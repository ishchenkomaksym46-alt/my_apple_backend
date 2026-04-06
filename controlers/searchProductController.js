import { pool } from "../db.js";

export const searchProductController = async (req, res) => {
    const { search, page = 1 } = req.query;
    const limit = 10;

    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 1) {
        return res.status(400).json({ success: false, message: 'Invalid page number' });
    }

    const offset = (pageNum - 1) * limit;

    try {
        const countResult = await pool.query('SELECT COUNT(*) FROM products WHERE name ILIKE $1', [`%${search}%`]);
        const totalItems = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit);

        if (pageNum > totalPages && totalPages > 0) {
            return res.status(404).json({ success: false, message: 'Page not found' });
        }

        const result = await pool.query('SELECT * FROM products WHERE name ILIKE $1 ORDER BY price DESC LIMIT $2 OFFSET $3', [`%${search}%`, limit, offset]);

        if(result.rows.length === 0) {
            return res.json({ success: false });
        }

        return res.json({
            success: true,
            result: result.rows
        })
    } catch (error) {
        return res.json({ success: false });
    }
}