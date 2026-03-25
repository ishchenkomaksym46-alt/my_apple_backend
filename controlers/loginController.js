import { pool } from "../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginController = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await pool.query('SELECT * FROM users WHERE $1 = email', [email]);

        if(user.rows.length === 0) {
            return res.status(400).json({ message: 'Incorrect email or password!'});
        }

        const valid = await bcrypt.compare(password, user.rows[0].password);

        if(!valid) {
            return res.status(400).json({ message: 'Incorrect email or password!' });
        }

        const token = jwt.sign(
            { id: user.rows[0].id, role: user.rows[0].role },
            process.env.DB_SECRET,
            { expiresIn: '1h' }
        );
        return res.json({ token });
    } catch (error) {
        return res.status(400).json({ message: 'Incorrect email or password!'});
    }
}
