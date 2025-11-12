const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        orderItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                name: { type: String, required: true },
                image: { type: String },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],

        shippingAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            addressLine1: { type: String, required: true },
            addressLine2: { type: String, default: "" },
            city: { type: String, required: true },
            state: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "UPI", "CARD"],
            default: "COD",
        },

        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED"],
            default: "PENDING",
        },

        totalAmount: {
            type: Number,
            required: true,
            min: [0, "Total amount cannot be negative"],
        },

        orderStatus: {
            type: String,
            enum: ["PROCESSING", "DELIVERED", "CANCELLED"],
            default: "PROCESSING",
        },
    },
    { timestamps: true }
);


const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

