const { hash } = require("bcryptjs");
const { Schema, model } = require("mongoose");
const { logger } = require('../helpers');


const userSchema = new Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        mobile: String,
        password: String,
        roleId: {
            type: Schema.Types.ObjectId,
            ref: "Role",
            required: true,
        },
        isSocial: { type: Boolean, default: false },
        isGuest: { type: Boolean, default: false },
        guestId: { type: String },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true, versionKey: false, }
);

userSchema.pre('save', async function (next) {
    try {        
        if (Boolean(this.password) && (this.isModified('password') || this.isNew))
            this.password = await hash(this.password, 10);

        next();
    } catch (error) {
        logger.error(`PRE SAVE ERROR: ${error}`);
        next(error);
    }
});

userSchema.pre('findByIdAndUpdate', async function (next) {
    try {
        console.log("THIS-----",this);
        
        if (Boolean(this.password) && this.isModified('password'))
            this.password = await hash(this.password, 10);

        next();
    } catch (error) {
        logger.error(`PRE SAVE ERROR: ${error}`);
        next(error);
    }
});

userSchema.set("toJSON", {
    transform: function (doc, ret, opt) {
        delete ret["password"];
        return ret;
    },
});

let userModel = model("User", userSchema, "User");
module.exports = userModel;
