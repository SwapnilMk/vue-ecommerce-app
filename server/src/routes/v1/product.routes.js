const express = require("express");
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../../controllers/product.controller.js");

const { protect, isAdmin } = require("../../middleware/auth.middleware.js");
const upload = require("../../middleware/multer.middleware.js");

// Public
router.get("/", getProducts);
router.get("/:id", getProduct);

// Admin only
router.post("/", protect, isAdmin, upload.array("images"), createProduct);
router.put("/:id", protect, isAdmin, upload.array("images"), updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);

module.exports = router;
