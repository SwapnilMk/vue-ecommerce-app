const express = require("express");
const router = express.Router();
const userRoutes = require("./user.routes.js");
const productRoutes = require("./product.routes.js");
const orderRoutes = require("./order.routes.js");
const dashboardRoutes = require("./dashboard.routes.js");
const cartRoutes = require("./cart.routes.js");
const wishlistRoutes = require("./wishlist.routes.js");

router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/cart", cartRoutes);
router.use("/wishlist", wishlistRoutes);

module.exports = router;
