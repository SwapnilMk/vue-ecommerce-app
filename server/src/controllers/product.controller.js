const {
    createProductService,
    getAllProductsService,
    getProductByIdService,
    updateProductService,
    deleteProductService,
} = require("../services/product.service.js");


// Get all products
const getProducts = async (req, res) => {
    try {
        const result = await getAllProductsService();

        res.status(200).json({
            success: true,
            message: "Products retrieved successfully",
            ...result,
        });
    } catch (error) {
        console.error("Error fetching products:", error.message);
        res.status(400).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};


// Get single product
const getProduct = async (req, res) => {
    try {
        const result = await getProductByIdService(req.params.id);

        res.status(200).json({
            success: true,
            message: "Product retrieved successfully",
            ...result,
        });
    } catch (error) {
        console.error("Error fetching product:", error.message);
        res.status(404).json({
            success: false,
            message: error.message || "Product not found",
        });
    }
};


// Create a product
const createProduct = async (req, res) => {
    try {
        const result = await createProductService(req.body);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            ...result,
        });
    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(400).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};


// Update a product
const updateProduct = async (req, res) => {
    try {
        const result = await updateProductService(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            ...result,
        });
    } catch (error) {
        console.error("Error updating product:", error.message);
        res.status(404).json({
            success: false,
            message: error.message || "Product not found",
        });
    }
};


// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const result = await deleteProductService(req.params.id);

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            ...result,
        });
    } catch (error) {
        console.error("Error deleting product:", error.message);
        res.status(404).json({
            success: false,
            message: error.message || "Product not found",
        });
    }
};


module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
};
