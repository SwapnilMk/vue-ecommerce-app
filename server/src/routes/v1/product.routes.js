const express = require("express");
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../../controllers/product.controller.js");

const { isAdmin } = require("../../middleware/auth.middleware.js");

// Public
router.get("/", getProducts);
router.get("/:id", getProduct);

// Admin only
router.post("/", isAdmin, createProduct);
router.put("/:id", isAdmin, updateProduct);
router.delete("/:id", isAdmin, deleteProduct);

module.exports = router;
