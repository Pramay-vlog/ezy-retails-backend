const Joi = require("joi");
const validator = require("../../middleware/validator");
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {

    create: validator({
        body: Joi.object({
            productIds: Joi.array().items(
                Joi.string()
                    .pattern(/^[0-9a-fA-F]{24}$/)
                    .message("Invalid ")
                    .required()
            ).required(),
            price_data: Joi.object({
                currency: Joi.string().required(),
            }).required(),
            quantities: Joi.array().items(Joi.number().required()).required(),
        }),
    }),

};
