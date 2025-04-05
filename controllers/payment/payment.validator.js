const Joi = require("joi");
const validator = require("../../middleware/validator");
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {

    create: validator({
        body: Joi.object({
            cartIds: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).required(),
            shippingAddressId: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ").required(),
            coupenCode: Joi.string(),
            walletAmount: Joi.number(),
            shippingCharge: Joi.number(),
            shippingType: Joi.string(),

        }),
    }),

};
