const Product = require("../models/product.model.js");
const { uploadToCloudinary } = require("../config/cloudinary.js");

// Create product
const createProductService = async (data, files) => {
    const { name, description, price, category, brand, stock } = data;

    const images = [];
    if (files) {
        for (const file of files) {
            const result = await uploadToCloudinary(file.path);
            images.push(result.secure_url);
        }
    }

    const product = await Product.create({
        name,
        description,
        price,
        category,
        brand,
        stock,
        images,
    });
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
const updateProductService = async (id, data, files) => {
    const { name, description, price, category, brand, stock } = data;

    const images = [];
    if (files) {
        for (const file of files) {
            const result = await uploadToCloudinary(file.path);
            images.push(result.secure_url);
        }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
            name,
            description,
            price,
            category,
            brand,
            stock,
            $push: { images: { $each: images } },
        },
        {
            new: true,
            runValidators: true,
        }
    );

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
