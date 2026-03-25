import { pool } from '../db.js';

export const removeFromCartController = async (req, res) => {
    const { id } = req.params;

    try {
        const cartItem = await pool.query(
            'SELECT * FROM cart WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        );

        if (cartItem.rows.length === 0) {
            return res.status(404).json({ message: 'Cart item not found.' });
        }

        if (cartItem.rows[0].quantity > 1) {
            const updatedItem = await pool.query(
                'UPDATE cart SET quantity = quantity - 1 WHERE id = $1 RETURNING *',
                [id]
            );

            return res.json({
                message: 'Product quantity decreased in cart.',
                item: updatedItem.rows[0]
            });
        }

        await pool.query('DELETE FROM cart WHERE id = $1 AND user_id = $2', [id, req.user.id]);

        return res.json({ message: 'Product removed from cart.' });
    } catch (error) {
        return res.status(500).json({ message: 'Cannot remove product from cart.' });
    }
};
