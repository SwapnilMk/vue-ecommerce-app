const User = require("../models/user.model.js");
const Product = require("../models/product.model.js");

// Add to cart
const addToCartService = async (userId, productId, qty = 1) => {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!product) throw new Error("Product not found");

    let item = user.cart?.find((i) => i.product.toString() === productId);

    if (item) {
        item.quantity += qty;
    } else {
        user.cart.push({ product: productId, quantity: qty });
    }

    await user.save();

    return { cart: user.cart };
};

// Remove item
const removeCartItemService = async (userId, productId) => {
    const user = await User.findById(userId);

    user.cart = user.cart.filter((i) => i.product.toString() !== productId);
    await user.save();

    return { cart: user.cart };
};

// Get cart
const getCartService = async (userId) => {
    const user = await User.findById(userId).populate("cart.product");
    return { cart: user.cart };
};

module.exports = {
    addToCartService,
    removeCartItemService,
    getCartService,
};
