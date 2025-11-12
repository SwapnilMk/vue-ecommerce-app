const express = require("express");
const router = express.Router();
const userRoutes = require("./user.routes.js");
const productRoutes = require("./product.routes.js");
const orderRoutes = require("./order.routes.js");

router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);

module.exports = router;
