const express = require("express");
const router = express.Router();

const {
    addToCart,
    removeFromCart,
    getCart,
} = require("../../controllers/cart.controller.js");

const { isUser } = require("../../middleware/auth.middleware.js");

router.get("/", isUser, getCart);
router.post("/:productId", isUser, addToCart);
router.delete("/:productId", isUser, removeFromCart);

module.exports = router;
