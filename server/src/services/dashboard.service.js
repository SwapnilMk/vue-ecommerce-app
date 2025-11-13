const User = require("../models/user.model.js");
const Product = require("../models/product.model.js");
const Order = require("../models/order.model.js");

const getDashboardDataService = async () => {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const totalRevenue = await Order.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: "$totalAmount" },
            },
        },
    ]);

    const recentOrders = await Order.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name");

    // agetDashboardDataServiceggregate orders by month for graph
    const ordersByMonth = await Order.aggregate([
        {
            $group: {
                _id: { $month: "$createdAt" },
                count: { $sum: 1 },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);

    return {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        recentOrders,
        ordersByMonth,
    };
};

module.exports = { getDashboardDataService };
