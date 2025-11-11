const { createUserService } = require("../services/user.service");


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

module.exports = { createUser };
