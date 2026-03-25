import { pool } from "../db.js";

export const productController = async (req, res) => {
    try {
        const products = await pool.query('SELECT * FROM products ORDER BY id DESC')
        return res.json(products.rows);
    } catch (error) {
        return res.status(500).json({ message: 'Cannot get current products!' });
    }
}