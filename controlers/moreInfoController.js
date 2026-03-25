import { pool } from "../db.js";

export const moreInfoController = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM products WHERE ID = $1', [id]);

        if(result.rows.length === 0) {
            return res.status(401).json({ succes: false });
        }

        return res.json({
            data: result.rows,
            succes: true
        })
    } catch (error) {
        return res.status(401).json({ succes: false });
    }
}