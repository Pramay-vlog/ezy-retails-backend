const { Schema, model } = require("mongoose");

const productSchema = new Schema(
    {

        name: { type: String },
        sizes: [String],
        media: [{
            color: { type: String, default: null },
            images: [String],
            actualPrice: { type: Number, default: null },
            price: { type: Number, default: null },
            discount: { type: Number, default: null },
        }],
        features: { type: String },
        description: {
            about: String,
            material: String,
            care: String,
        },
        categoryId: { type: Schema.Types.ObjectId, ref: "Category", index: true },
        subCategoryId: { type: Schema.Types.ObjectId, ref: "Subcategory", index: true },
        productTags: [{ type: Schema.Types.ObjectId, ref: "ProductTags" }],
        stock: { type: Number, default: 0 },
        actualPrice: { type: Number, default: null },
        price: { type: Number, default: null },
        discount: { type: Number, default: null },
        state: { type: String },
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
