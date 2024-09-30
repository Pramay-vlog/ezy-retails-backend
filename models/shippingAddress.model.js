const { Schema, model } = require("mongoose");

const shippingAddressSchema = new Schema(
    {

        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        pinCode: { type: String },
        isDefault: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true }

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

let shippingAddressModel = model("ShippingAddress", shippingAddressSchema, "ShippingAddress");

module.exports = shippingAddressModel;
