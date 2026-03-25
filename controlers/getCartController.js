import { pool } from '../db.js';

export const getCartController = async (req, res) => {
    try {
        const cartItems = await pool.query(
            'SELECT * FROM cart WHERE user_id = $1 ORDER BY id DESC',
            [req.user.id]
        );

        return res.json(cartItems.rows);
    } catch (error) {
        return res.status(500).json({ message: 'Cannot get cart items.' });
    }
};
