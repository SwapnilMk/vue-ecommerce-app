const express = require("express");
const router = express.Router();

const {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
} = require("../../controllers/wishlist.controller.js");

const { protect, isUser } = require("../../middleware/auth.middleware.js");

router.get("/", protect, isUser, getWishlist);
router.post("/:productId", protect, isUser, addToWishlist);
router.delete("/:productId", protect, isUser, removeFromWishlist);

module.exports = router;
