const { Schema, model } = require("mongoose");

const productTagsSchema = new Schema(
    {

        name: { type: String },
        isActive: { type: Boolean, default: true }

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

let productTagsModel = model("ProductTags", productTagsSchema, "ProductTags");

module.exports = productTagsModel;
