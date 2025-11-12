const {
    addToWishlistService,
    removeFromWishlistService,
    getWishlistService,
} = require("../services/wishlist.service.js");

const addToWishlist = async (req, res) => {
    try {
        const result = await addToWishlistService(req.user._id, req.params.productId);
        res.status(200).json({ success: true, message: "Added to wishlist", ...result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const result = await removeFromWishlistService(req.user._id, req.params.productId);
        res.status(200).json({ success: true, message: "Removed from wishlist", ...result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getWishlist = async (req, res) => {
    try {
        const result = await getWishlistService(req.user._id);
        res.status(200).json({ success: true, message: "Wishlist fetched", ...result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
};
