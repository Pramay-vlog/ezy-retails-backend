const { Schema, model } = require("mongoose");

const productVariantsSchema = new Schema(
  {
    attributeId: {
      type: Schema.Types.ObjectId,
      ref: "productAttribute",
      required: true
    },
    name: {
      type: Schema.Types.String,
      required: true
    },
    description: {
      type: Schema.Types.String
    },
    slug: {
      type: Schema.Types.String,
      required: true
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: true,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


const productVariantsModel = model("productVariants", productVariantsSchema, "productVariants");

module.exports = productVariantsModel;