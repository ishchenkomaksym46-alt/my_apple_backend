import { pool } from "../db.js";

export const orderOneController = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query(`INSERT INTO orders (user_id, product_id) VALUES 
            ($1, $2)`, [req.user.id, id]);

        return res.json({ succes: true });
    } catch (error) {
        return res.status(403).json({ succes: false });
    }
}