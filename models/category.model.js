const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
    {

        name: { type: String },
        image: { type: String, default: null },
        isActive: { type: Boolean, default: true }

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

let categoryModel = model("Category", categorySchema, "Category");

module.exports = categoryModel;
