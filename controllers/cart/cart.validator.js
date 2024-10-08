const Joi = require("joi");
const validator = require("../../middleware/validator");
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {

    create: validator({
        body: Joi.object({
            userId: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID"),
            productId: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .required(),
            subProductId: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .required(),
            quantity: Joi.number().required(),
        }),
    }),


    update: validator({
        body: Joi.object({
            quantity: Joi.number().min(1),
        }),
        params: Joi.object({
            _id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .required(),
        }),
    }),


    fetch: validator({
        query: Joi.object({
            page: Joi.number().default(1),
            limit: Joi.number().default(100),
            sortBy: Joi.string(),
            sortOrder: Joi.string(),
            search: Joi.string(),

            _id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .custom((value, helpers) => new ObjectId(value)),
            userId: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .custom((value, helpers) => new ObjectId(value)),
        }),
    }),

    delete: validator({
        params: Joi.object({
            _id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .required(),
        }),
    }),

};
