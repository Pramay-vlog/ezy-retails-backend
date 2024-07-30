const Joi = require("joi");
const validator = require("../../middleware/validator");
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {

    create: validator({
        body: Joi.object({
            title: Joi.string().required(),
            subTitle: Joi.string().required(),
            isActive: Joi.boolean().default(true),
        }),
    }),


    update: validator({
        body: Joi.object({
            title: Joi.string(),
            subTitle: Joi.string(),
            priority: Joi.number(),
            isActive: Joi.boolean().default(true),
        }),
        params: Joi.object({
            _id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .required(),
        }),
    }),


    toggleActive: validator({
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
            sortBy: Joi.string().default('createdAt'),
            sortOrder: Joi.string().valid('1', '-1').default('1'),
            search: Joi.string(),
            isActive: Joi.boolean(),

            _id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .custom((value, helpers) => new ObjectId(value)),
        }),
    }),

};
