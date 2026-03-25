import { pool } from "../db.js"
import bcrypt from 'bcrypt';

export const registerController = async (req, res) => {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    try {
        await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hash]);
        return res.json({ message: 'User created!' })
    } catch (error) {
        res.status(400).json({ message: 'User alredy exists!' });
    }
}