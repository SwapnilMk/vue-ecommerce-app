const {
    addToCartService,
    removeCartItemService,
    getCartService,
} = require("../services/cart.service.js");

const addToCart = async (req, res) => {
    try {
        const qty = req.body.quantity || 1;
        const result = await addToCartService(req.user._id, req.params.productId, qty);

        res.status(200).json({
            success: true,
            message: "Product added to cart",
            ...result,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const result = await removeCartItemService(req.user._id, req.params.productId);

        res.status(200).json({
            success: true,
            message: "Removed from cart",
            ...result,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getCart = async (req, res) => {
    try {
        const result = await getCartService(req.user._id);

        res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            ...result,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    addToCart,
    removeFromCart,
    getCart,
};
