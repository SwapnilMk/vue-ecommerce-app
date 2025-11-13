const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Not authorized as an admin' });
    }
};

const isUser = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Not authorized' });
    }
};

module.exports = { protect, isAdmin, isUser };
