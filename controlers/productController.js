import { pool } from "../db.js";

export const productController = async (req, res) => {
    const { sort = 'id_desc' } = req.query;

    const sortMap = {
        price_asc: 'price ASC, id DESC',
        price_desc: 'price DESC, id DESC',
        id_asc: 'id ASC',
        id_desc: 'id DESC'
    };

    const orderBy = sortMap[sort] || sortMap.id_desc

    try {
        const products = await pool.query(`SELECT * FROM products ORDER BY ${orderBy}`);
        return res.json(products.rows);
    } catch (error) {
        return res.status(500).json({ message: 'Cannot get current products!' });
    }
}