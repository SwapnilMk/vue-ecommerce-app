const express = require("express");
const router = express.Router();

const {
    getOrders,
    getOrder,
    createOrder,
    updateOrderToPaid,
    updateOrderToDelivered,
} = require("../../controllers/order.controller.js");

const { isUser, isAdmin } = require("../../middleware/auth.middleware.js");

// Admin: Get all orders
router.get("/", isAdmin, getOrders);

// Admin + User can get single order
router.get("/:id", isUser, getOrder);

// User creates order
router.post("/", isUser, createOrder);

// User marks order as paid
router.put("/:id/pay", isUser, updateOrderToPaid);

// Admin delivers order
router.put("/:id/deliver", isAdmin, updateOrderToDelivered);

module.exports = router;
