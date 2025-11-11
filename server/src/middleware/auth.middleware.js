const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

// middleware for user
const isUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user not found",
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("JWT verification error:", error.message);
        res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

// middleware for admin
const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Access denied Admin role required",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Admin check failed:", error.message);
        res.status(401).json({
            success: false,
            message: "Invalid token or unauthorized",
        });
    }
};

module.exports = { isUser, isAdmin };
