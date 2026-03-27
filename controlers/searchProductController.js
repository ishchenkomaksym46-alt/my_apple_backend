import { pool } from "../db.js";

export const searchProductController = async (req, res) => {
    const { search } = req.query;

    try {
        const result = await pool.query('SELECT * FROM products WHERE name ILIKE $1 ORDER BY price DESC', [`%${search}%`]);

        if(result.rows.length === 0) {
            return res.json({ succes: false });
        }

        return res.json({
            succes: true,
            result: result.rows
        })
    } catch (error) {
        return res.json({ succes: false });
    }
}