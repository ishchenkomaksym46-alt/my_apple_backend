import { pool } from "../db.js";

export const deleteProductController = async (req, res) => {
    const { id } = req.body;

    try {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

        if(result.rows.length === 0) {
            return res.status(401).json({ succes: false });
        }

        await pool.query('DELETE FROM products WHERE id = $1', [id])
        return res.json({ succes: true });
    } catch (error) {
        return res.status(401).json({ succes: false });
    }
}