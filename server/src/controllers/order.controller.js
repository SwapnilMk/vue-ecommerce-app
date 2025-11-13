const {
    getAllOrdersService,
    getOrderByIdService,
    getUserOrdersService,
    createOrderService,
    updateOrderToPaidService,
    updateOrderToDeliveredService,
} = require("../services/order.service.js");

// Get all orders (Admin)
const getOrders = async (req, res) => {
    try {
        const result = await getAllOrdersService();
        res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            ...result,
        });
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        res.status(400).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

// Get user orders
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const result = await getUserOrdersService(userId);
        res.status(200).json({
            success: true,
            message: "User orders retrieved successfully",
            ...result,
        });
    } catch (error) {
        console.error("Error fetching user orders:", error.message);
        res.status(400).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

// Get single order
const getOrder = async (req, res) => {
    try {
        const result = await getOrderByIdService(req.params.id);
        res.status(200).json({
            success: true,
            message: "Order retrieved successfully",
            ...result,
        });
    } catch (error) {
        console.error("Error fetching order:", error.message);
        res.status(404).json({
            success: false,
            message: error.message || "Order not found",
        });
    }
};

// Create order
const createOrder = async (req, res) => {
    try {
        const userId = req.user?._id || req.body.user;
        const result = await createOrderService(req.body, userId);
        res.status(201).json({
            success: true,
            message: "Order created successfully",
            ...result,
        });
    } catch (error) {
        console.error("Error creating order:", error.message);
        res.status(400).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

// Update to PAID
const updateOrderToPaid = async (req, res) => {
    try {
        const result = await updateOrderToPaidService(req.params.id);
        res.status(200).json({
            success: true,
            message: "Order updated to PAID",
            ...result,
        });
    } catch (error) {
        console.error("Error updating order:", error.message);
        res.status(400).json({
            success: false,
            message: error.message || "Failed to update order",
        });
    }
};

// Update to DELIVERED
const updateOrderToDelivered = async (req, res) => {
    try {
        const result = await updateOrderToDeliveredService(req.params.id);
        res.status(200).json({
            success: true,
            message: "Order updated to DELIVERED",
            ...result,
        });
    } catch (error) {
        console.error("Error updating order:", error.message);
        res.status(400).json({
            success: false,
            message: error.message || "Failed to update order",
        });
    }
};

module.exports = {
    getOrders,
    getUserOrders,
    getOrder,
    createOrder,
    updateOrderToPaid,
    updateOrderToDelivered,
};