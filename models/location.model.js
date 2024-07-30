const { Schema, model } = require("mongoose");

const locationSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
        firstName: { type: String },
        lastName: { type: String },
        mobile: { type: String },
        email: { type: String },
        address: { type: String },
        pinCode: { type: String },
        city: { type: String },
        state: { type: String },
        coutry: { type: String },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

let locationModel = model("Location", locationSchema, "Location");

module.exports = locationModel;
