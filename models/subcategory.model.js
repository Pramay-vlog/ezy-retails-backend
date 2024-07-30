const { Schema, model } = require("mongoose");

const subcategorySchema = new Schema(
    {

        name: { type: String },
        categoryId: { type: Schema.Types.ObjectId, ref: "category", index: true },
        isActive: { type: Boolean, default: true }

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

let subcategoryModel = model("Subcategory", subcategorySchema, "Subcategory");

module.exports = subcategoryModel;
