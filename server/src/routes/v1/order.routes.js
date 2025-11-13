const express = require("express");
const router = express.Router();

const {
    getOrders,
    getOrder,
    createOrder,
    updateOrderToPaid,
    updateOrderToDelivered,
} = require("../../controllers/order.controller.js");

const { protect, isAdmin, isUser } = require("../../middleware/auth.middleware.js");

// Admin: Get all orders
router.get("/", protect, isAdmin, getOrders);

// Admin + User can get single order
router.get("/:id", protect, isUser, getOrder);

// User creates order
router.post("/", protect, isUser, createOrder);

// User marks order as paid
router.put("/:id/pay", protect, isUser, updateOrderToPaid);

// Admin delivers order
router.put("/:id/deliver", protect, isAdmin, updateOrderToDelivered);

module.exports = router;
