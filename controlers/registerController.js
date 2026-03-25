import { pool } from "../db.js";
import bcrypt from 'bcrypt';

export const registerController = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required.',
            code: 'VALIDATION_ERROR'
        });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hash]);
        return res.json({ message: 'User created!' });
    } catch (error) {
        console.error('Register error:', {
            message: error.message,
            code: error.code,
            detail: error.detail
        });

        if (error.code === '23505') {
            return res.status(409).json({
                message: 'User already exists!',
                code: 'USER_ALREADY_EXISTS'
            });
        }

        return res.status(500).json({
            message: 'Registration failed.',
            code: error.code || 'REGISTER_INTERNAL_ERROR',
            details: error.detail || error.message
        });
    }
};
