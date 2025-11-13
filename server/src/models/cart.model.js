const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, "Quantity can not be less then 1."],
                    default: 1,
                },
            },
        ],
        coupon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coupon",
        },
    },
    { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
