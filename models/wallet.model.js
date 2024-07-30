const { Schema, model } = require("mongoose");

const walletSchema = new Schema(
    {

        name: { type: String },
        offer: { type: Number },
        isActive: { type: Boolean, default: true }

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

let walletModel = model("Wallet", walletSchema, "Wallet");

module.exports = walletModel;
