export default function roleMiddleware(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'User is not authenticated.' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'User is not admin.' });
    }

    next();
}
