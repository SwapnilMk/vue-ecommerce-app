const Cart = require("../models/cart.model.js");
const Product = require("../models/product.model.js");

// Add to cart
const addToCartService = async (userId, productId, qty = 1) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    let cart = await Cart.findOne({ user: userId });

    if (cart) {
        const itemIndex = cart.items.findIndex((p) => p.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += qty;
        } else {
            cart.items.push({ product: productId, quantity: qty });
        }
    } else {
        cart = await Cart.create({
            user: userId,
            items: [{ product: productId, quantity: qty }],
        });
    }
    await cart.save();
    return { cart };
};

// Remove item
const removeCartItemService = async (userId, productId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    await cart.save();

    return { cart };
};

// Get cart
const getCartService = async (userId) => {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) throw new Error("Cart not found");
    return { cart };
};

module.exports = {
    addToCartService,
    removeCartItemService,
    getCartService,
};
