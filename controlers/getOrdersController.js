import { pool } from "../db.js";

export const getOrderController = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC', [req.user.id]);

        return res.json({
            succes: true,
            orders: result.rows
        })
    } catch (error) {
        return res.status(500).json({ succes: false });
    }
}