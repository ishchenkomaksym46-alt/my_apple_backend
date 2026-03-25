import { pool } from '../db.js';

export const addToCartController = async (req, res) => {
    const {
        product_name,
        product_description,
        product_price
    } = req.body;

    if (
        typeof product_name !== 'string' ||
        typeof product_description !== 'string' ||
        product_price === undefined ||
        product_price === null
    ) {
        return res.status(400).json({ message: 'Product data is required.' });
    }

    try {
        const existingItem = await pool.query(
            `SELECT id, quantity
             FROM cart
             WHERE user_id = $1
               AND product_name = $2
               AND product_description = $3
               AND product_price = $4`,
            [req.user.id, product_name, product_description, product_price]
        );

        if (existingItem.rows.length > 0) {
            const updatedItem = await pool.query(
                'UPDATE cart SET quantity = quantity + 1 WHERE id = $1 RETURNING *',
                [existingItem.rows[0].id]
            );

            return res.json({
                message: 'Product quantity increased in cart.',
                item: updatedItem.rows[0]
            });
        }

        const newItem = await pool.query(
            `INSERT INTO cart (user_id, product_name, product_description, product_price, quantity)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [req.user.id, product_name, product_description, product_price, 1]
        );

        return res.status(201).json({
            message: 'Product added to cart.',
            item: newItem.rows[0]
        });
    } catch (error) {
        return res.status(500).json({ message: 'Cannot add product to cart.' });
    }
};