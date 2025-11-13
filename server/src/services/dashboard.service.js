const { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } = require('date-fns')
const User = require('../models/user.model.js')
const Order = require('../models/order.model.js')
const Product = require('../models/product.model.js')

const getDashboardDataService = async () => {
    const totalUsers = await User.countDocuments({ role: 'USER' })
    const totalOrders = await Order.countDocuments()
    const totalRevenue = await Order.aggregate([
        { $match: { paymentStatus: 'PAID' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]).then((result) => (result[0]?.total || 0))
    const totalProducts = await Product.countDocuments()

    return {
        totalUsers,
        totalOrders,
        totalRevenue,
        totalProducts,
    }
}


const getOrderChartDataService = async (period, startDate, endDate) => {
    const groupBy = {
        daily: { unit: 'day', date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } },
        weekly: { unit: 'week', date: { $week: '$createdAt' } },
        monthly: { unit: 'month', date: { $month: '$createdAt' } },
    }[period]

    if (!groupBy) {
        throw new Error('Invalid period')
    }

    const data = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfDay(startDate), $lte: endOfDay(endDate) },
                paymentStatus: 'PAID',
            },
        },
        {
            $group: {
                _id: groupBy.date,
                date: { $first: '$createdAt' },
                amount: { $sum: '$totalAmount' },
            },
        },
        { $sort: { date: 1 } },
        {
            $project: {
                _id: 0,
                date: 1,
                amount: 1,
            },
        },
    ])

    return data
}


module.exports = { getDashboardDataService, getOrderChartDataService }