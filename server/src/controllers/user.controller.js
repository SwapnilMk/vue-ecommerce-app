const { createUserService, loginUserService, getAllUsersService } = require("../services/user.service.js");


const createUser = async (req, res) => {
    try {
        const result = await createUserService(req.body);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            ...result,
        });
    } catch (error) {
        console.error("Error creating user:", error.message);
        res.status(400).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const result = await loginUserService(req.body)
        res.status(200).json({
            success: true,
            message: "Login successful",
            ...result,
        })
    } catch (error) {
        console.error("Login error:", error.message)
        res.status(400).json({
            success: false,
            message: error.message || "Invalid credentials",
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const result = await getAllUsersService();

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            ...result,
        });
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(400).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

module.exports = { createUser, loginUser, getAllUsers };
