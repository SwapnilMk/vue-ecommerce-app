const express = require("express");
const router = express.Router();

const {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
} = require("../../controllers/wishlist.controller.js");

const { isUser } = require("../../middleware/auth.middleware.js");

router.get("/", isUser, getWishlist);
router.post("/:productId", isUser, addToWishlist);
router.delete("/:productId", isUser, removeFromWishlist);

module.exports = router;
