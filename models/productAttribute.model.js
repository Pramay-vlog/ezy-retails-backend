const { Schema, model } = require("mongoose");

const productAttributeSchema = new Schema(
  {
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


const productAttributeModel = model("productAttribute", productAttributeSchema, "productAttribute");

module.exports = productAttributeModel;