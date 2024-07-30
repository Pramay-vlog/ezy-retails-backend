const Joi = require("joi");
const validator = require("../../middleware/validator");
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {

    create: validator({
        body: Joi.object({
            userId: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID"),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            mobile: Joi.string().required(),
            email: Joi.string().required(),
            address: Joi.string().required(),
            pinCode: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            coutry: Joi.string().required(),
        }),
    }),


    update: validator({
        body: Joi.object({
            userId: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID"),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            mobile: Joi.string().required(),
            email: Joi.string().required(),
            address: Joi.string().required(),
            pinCode: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            coutry: Joi.string().required(),
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
            sortBy: Joi.string(),
            sortOrder: Joi.string(),
            search: Joi.string(),

            _id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .custom((value, helpers) => new ObjectId(value)),
        }),
    }),

};
