export const checkRoleController = async (req, res) => {
    try {
        if(req.user.role === 'admin') {
            return res.json({ succes: true, admin: true });
        } else {
            return res.json({ succes: true, admin: false });
        }
    } catch (error) {
        return res.json({ succes: false, admin: false });
    }
}