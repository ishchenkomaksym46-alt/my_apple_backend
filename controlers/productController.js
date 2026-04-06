import { pool } from "../db.js";

export const productController = async (req, res) => {
    const { sort = 'id_desc', page = 1 } = req.query;
    const limit = 10;

    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 1) {
        return res.status(400).json({ message: 'Invalid page number' });
    }

    const offset = (pageNum - 1) * limit;

    const sortMap = {
        price_asc: 'price ASC, id DESC',
        price_desc: 'price DESC, id DESC',
        id_asc: 'id ASC',
        id_desc: 'id DESC'
    };

    const orderBy = sortMap[sort] || sortMap.id_desc;

    try {
        const countResult = await pool.query('SELECT COUNT(*) FROM products');
        const totalItems = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit);

        if (pageNum > totalPages && totalPages > 0) {
            return res.status(404).json({ message: 'Page not found' });
        }

        const products = await pool.query(`SELECT * FROM products ORDER BY ${orderBy} LIMIT $1 OFFSET $2`, [limit, offset]);
        return res.json(products.rows);
    } catch (error) {
        return res.status(500).json({ message: 'Cannot get current products!' });
    }
}