const Product = require("../models/product.model.js");

// Create product
const createProductService = async (data) => {
    const product = await Product.create(data);
    return { product };
};

// Get all products
const getAllProductsService = async () => {
    const products = await Product.find({});
    return { products };
};

// Get single product
const getProductByIdService = async (id) => {
    const product = await Product.findById(id);

    if (!product) {
        throw new Error("Product not found");
    }

    return { product };
};

// Update product
const updateProductService = async (id, data) => {
    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!updatedProduct) {
        throw new Error("Product not found");
    }

    return { updatedProduct };
};

// Delete product
const deleteProductService = async (id) => {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
        throw new Error("Product not found");
    }

    return { deletedProduct };
};

module.exports = {
    createProductService,
    getAllProductsService,
    getProductByIdService,
    updateProductService,
    deleteProductService,
};
