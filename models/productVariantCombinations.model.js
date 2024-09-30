const { Schema, model } = require("mongoose");

const productVariantCombinationsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true
    },
    productVariantIds: [{
      type: Schema.Types.ObjectId,
      ref: "productVariants",
      required: true
    }],
    combination: {
      type: Schema.Types.String,
      required: true
    },
    combinationSlug: {
      type: Schema.Types.String,
      required: true
    },
    sku: {
      type: Schema.Types.String,
    },
    price: {
      type: Schema.Types.Number,
      required: true
    },
    quantity: {
      type: Schema.Types.Number,
      required: true
    },
    unit: {
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


const productVariantCombinationsModel = model("productVariantCombinations", productVariantCombinationsSchema, "productVariantCombinations");

module.exports = productVariantCombinationsModel;