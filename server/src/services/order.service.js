const Order = require("../models/order.model.js");

// Get all orders (Admin)
const getAllOrdersService = async () => {
    const orders = await Order.find({})
        .populate("user", "name email")
        .populate("orderItems.product", "name price");
    return { orders };
};

// Get user orders
const getUserOrdersService = async (userId) => {
    const orders = await Order.find({ user: userId })
        .populate("user", "name email")
        .populate("orderItems.product", "name price images");
    return { orders };
};

// Get a single order
const getOrderByIdService = async (id) => {
    const order = await Order.findById(id)
        .populate("user", "name email phone")
        .populate("orderItems.product", "name price images");
    if (!order) {
        throw new Error("Order not found");
    }
    return { order };
};

// Create a new order
const createOrderService = async (data, userId) => {
    const order = await Order.create({
        ...data,
        user: userId,
    });
    return { order };
};

// Mark order as PAID
const updateOrderToPaidService = async (id) => {
    const order = await Order.findById(id);
    if (!order) {
        throw new Error("Order not found");
    }
    order.paymentStatus = "PAID";
    order.orderStatus = "PROCESSING";
    await order.save();
    return { order };
};

// Mark order as DELIVERED
const updateOrderToDeliveredService = async (id) => {
    const order = await Order.findById(id);
    if (!order) {
        throw new Error("Order not found");
    }
    order.orderStatus = "DELIVERED";
    await order.save();
    return { order };
};

module.exports = {
    getAllOrdersService,
    getUserOrdersService,
    getOrderByIdService,
    createOrderService,
    updateOrderToPaidService,
    updateOrderToDeliveredService,
};