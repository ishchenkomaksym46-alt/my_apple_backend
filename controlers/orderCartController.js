import { pool } from "../db.js";

export const orderCartController = async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const cartCountResult = await client.query(
            'SELECT COUNT(*)::int AS count FROM cart WHERE user_id = $1',
            [req.user.id]
        );

        if (cartCountResult.rows[0].count === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                succes: false,
                message: 'Cart is empty.'
            });
        }

        const matchedCartCountResult = await client.query(
            `SELECT COUNT(*)::int AS count
             FROM cart c
             JOIN products p
               ON p.name = c.product_name
              AND p.description = c.product_description
              AND p.price = c.product_price
             WHERE c.user_id = $1`,
            [req.user.id]
        );

        if (matchedCartCountResult.rows[0].count !== cartCountResult.rows[0].count) {
            await client.query('ROLLBACK');
            return res.status(409).json({
                succes: false,
                message: 'Some cart items no longer match existing products.'
            });
        }

        await client.query(
            `INSERT INTO orders (user_id, product_id)
             SELECT $1, p.id
             FROM cart c
             JOIN products p
               ON p.name = c.product_name
              AND p.description = c.product_description
              AND p.price = c.product_price
             JOIN generate_series(1, c.quantity) AS quantity_item ON true
             WHERE c.user_id = $1`,
            [req.user.id]
        );

        await client.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);
        await client.query('COMMIT');

        return res.json({
            succes: true,
            message: 'Cart order created successfully.'
        });
    } catch (error) {
        await client.query('ROLLBACK');
        return res.status(500).json({
            succes: false,
            message: 'Cannot create cart order.'
        });
    } finally {
        client.release();
    }
};
