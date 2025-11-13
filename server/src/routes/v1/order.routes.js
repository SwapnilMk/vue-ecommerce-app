const express = require("express");
const router = express.Router();

const {
    getOrders,
    getOrder,
    createOrder,
    updateOrderToPaid,
    updateOrderToDelivered,
    getUserOrders, // New controller function
} = require("../../controllers/order.controller.js");

const { protect, isAdmin, isUser } = require("../../middleware/auth.middleware.js");

// Admin: Get all orders
router.get("/all", protect, isAdmin, getOrders);

// User: Get their own orders
router.get("/", protect, isUser, getUserOrders);

// Admin + User: Get single order
router.get("/:id", protect, isUser, getOrder);

// User: Create order
router.post("/", protect, isUser, createOrder);

// User: Mark order as paid
router.put("/:id/pay", protect, isUser, updateOrderToPaid);

// Admin: Mark order as delivered
router.put("/:id/deliver", protect, isAdmin, updateOrderToDelivered);

module.exports = router;