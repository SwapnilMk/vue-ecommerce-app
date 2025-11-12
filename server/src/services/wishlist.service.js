const User = require("../models/user.model.js");
const Product = require("../models/product.model.js");

const addToWishlistService = async (userId, productId) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    const user = await User.findById(userId);

    if (user.wishlist.includes(productId)) {
        throw new Error("Already in wishlist");
    }

    user.wishlist.push(productId);
    await user.save();

    return { wishlist: user.wishlist };
};

const removeFromWishlistService = async (userId, productId) => {
    const user = await User.findById(userId);

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    return { wishlist: user.wishlist };
};

const getWishlistService = async (userId) => {
    const user = await User.findById(userId).populate("wishlist");
    return { wishlist: user.wishlist };
};

module.exports = {
    addToWishlistService,
    removeFromWishlistService,
    getWishlistService,
};
