const { Schema, model } = require("mongoose");

const heroSectionSchema = new Schema(
    {

        title: String,
        subTitle: String,
        image: { type: String, default: null },
        priority: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true }

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

let heroSectionModel = model("HeroSection", heroSectionSchema, "HeroSection");

module.exports = heroSectionModel;