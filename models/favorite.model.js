const { Schema, model } = require("mongoose");

const favoriteSchema = new Schema(
    {

        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        isActive: { type: Boolean, default: true }

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

let favoriteModel = model("Favorite", favoriteSchema, "Favorite");

module.exports = favoriteModel;
