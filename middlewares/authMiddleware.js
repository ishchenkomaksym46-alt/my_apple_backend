import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

export default async function auth(req, res, next) {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ message: 'Authorization header is required.' });
    }

    const [type, token] = header.split(' ');

    if (type !== 'Bearer') {
        return res.status(401).json({ message: 'Bearer token is required.' });
    }

    if (!token) {
        return res.status(401).json({ message: 'Bearer token is required.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.DB_SECRET);
        const user = await pool.query('SELECT id, email, role FROM users WHERE id = $1', [decoded.id]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'User is not logged in.' });
        }

        req.user = user.rows[0];
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
}
