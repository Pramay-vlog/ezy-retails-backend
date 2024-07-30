const { Schema, model } = require("mongoose");

let dataCountSchema = new Schema(
    {
        module: String,
        count: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true, versionKey: false, }
);

let dataCountModel = model("DataCount", dataCountSchema, "DataCount");

module.exports = dataCountModel;
