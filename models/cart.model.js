const { Schema, model } = require("mongoose");

const cartSchema = new Schema(
    {

        userId: { type: Schema.Types.ObjectId, ref: "User" },
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        size: { type: String, default: null },
        quantity: { type: Number, default: 1 }

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

let cartModel = model("Cart", cartSchema, "Cart");

module.exports = cartModel;
