const express = require("express");
const router = express.Router();

const {
    addToCart,
    removeFromCart,
    getCart,
} = require("../../controllers/cart.controller.js");

const { protect, isUser } = require("../../middleware/auth.middleware.js");

router.get("/", protect, isUser, getCart);
router.post("/:productId", protect, isUser, addToCart);
router.delete("/:productId", protect, isUser, removeFromCart);

module.exports = router;
