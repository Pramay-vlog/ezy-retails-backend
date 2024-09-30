const { Schema, model } = require("mongoose");

const subProductSchema = new Schema(
    {
        productId: { type: Schema.Types.ObjectId, ref: "Product", index: true, required: true },
        name: { type: String },
        images: [String],
        combination: { type: String, required: true },
        combinationSlug: { type: String, required: true },
        sku: String,
        stock: { type: Number, default: 0 },
        actualPrice: { type: Number, default: 0 },
        price: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        state: { type: String }, // In Stock, Out of Stock
        tax: { type: Number, default: 0 },
        shippingCharge: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

let productModel = model("SubProduct", subProductSchema, "SubProduct");

module.exports = productModel;
