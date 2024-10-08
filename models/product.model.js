const { Schema, model } = require("mongoose");

const productSchema = new Schema(
    {

        name: { type: String },
        images: [String],
        features: { type: String },
        description: {
            about: String,
            material: String,
            care: String,
        },
        categoryId: { type: Schema.Types.ObjectId, ref: "Category", index: true },
        sku: String,
        subCategoryId: { type: Schema.Types.ObjectId, ref: "Subcategory", index: true },
        productTags: [{ type: Schema.Types.ObjectId, ref: "ProductTags" }],
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

let productModel = model("Product", productSchema, "Product");

module.exports = productModel;
