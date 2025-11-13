const { getDashboardDataService, getOrderChartDataService } = require("../services/dashboard.service.js");

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

const getOrderChartData = async (req, res) => {
    try {
        const { period, start, end } = req.query
        if (!period || !start || !end) {
            throw new Error('Period, start date, and end date are required')
        }
        const data = await getOrderChartDataService(period, new Date(start), new Date(end))
        res.status(200).json({
            success: true,
            message: 'Order chart data retrieved successfully',
            data,
        })
    } catch (error) {
        console.error('Error fetching order chart data:', error.message)
        res.status(400).json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

module.exports = { getDashboardData, getOrderChartData }
