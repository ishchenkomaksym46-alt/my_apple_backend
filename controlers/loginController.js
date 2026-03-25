import { pool } from "../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginController = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required.',
            code: 'VALIDATION_ERROR'
        });
    }

    try {
        if (!process.env.DB_SECRET) {
            return res.status(500).json({
                message: 'DB_SECRET is not configured.',
                code: 'MISSING_DB_SECRET'
            });
        }

        const user = await pool.query(
            'SELECT id, email, password, role FROM users WHERE email = $1',
            [email]
        );

        if(user.rows.length === 0) {
            return res.status(400).json({
                message: 'Incorrect email or password!',
                code: 'INVALID_CREDENTIALS'
            });
        }

        if (!user.rows[0].password) {
            return res.status(500).json({
                message: 'Password hash is missing for this user.',
                code: 'MISSING_PASSWORD_HASH'
            });
        }

        const valid = await bcrypt.compare(password, user.rows[0].password);

        if(!valid) {
            return res.status(400).json({
                message: 'Incorrect email or password!',
                code: 'INVALID_CREDENTIALS'
            });
        }

        const token = jwt.sign(
            { id: user.rows[0].id, role: user.rows[0].role },
            process.env.DB_SECRET,
            { expiresIn: '1h' }
        );
        return res.json({ token });
    } catch (error) {
        console.error('Login error:', {
            message: error.message,
            code: error.code,
            detail: error.detail
        });

        return res.status(500).json({
            message: 'Login failed.',
            code: error.code || 'LOGIN_INTERNAL_ERROR',
            details: error.detail || error.message
        });
    }
};
