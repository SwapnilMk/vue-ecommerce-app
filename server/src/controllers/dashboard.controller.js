const { getDashboardDataService } = require("../services/dashboard.service.js");

const getDashboardData = async (req, res) => {
    try {
        const result = await getDashboardDataService();

        res.status(200).json({
            success: true,
            message: "Dashboard data retrieved successfully",
            ...result,
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error.message);
        res.status(400).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

module.exports = { getDashboardData };
