const db = require('../config/mockDb');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, flatId } = req.body;
        const exists = db.users.find(u => u.email === email);
        if (exists) return res.status(400).json({ success: false, message: 'User already exists' });

        const newUser = {
            _id: 'u' + (db.users.length + 1),
            name, email, password, role, flatId
        };
        db.users.push(newUser);
        sendTokenResponse(newUser, 201, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = db.users.find(u => u.email === email);
        
        if (!user || password !== 'password') { // Simplified for demo
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'demo_secret_key_123', { expiresIn: '30d' });
    res.status(statusCode).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, flatId: user.flatId }
    });
};
