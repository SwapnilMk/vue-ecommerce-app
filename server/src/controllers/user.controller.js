const { createUserService, loginUserService } = require("../services/user.service");


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

module.exports = { createUser, loginUser };
