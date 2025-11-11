const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },

        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
        },

        brand: {
            type: String,
            trim: true,
            default: "",
        },

        stock: {
            type: Number,
            required: [true, "Stock quantity is required"],
            min: [0, "Stock cannot be negative"],
            default: 0,
        },

        images: [
            {
                type: String,
                default: "",
            },
        ],
    },
    { timestamps: true }
);


const Product = mongoose.model("Product", productSchema);
