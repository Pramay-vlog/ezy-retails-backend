const Joi = require("joi");
const validator = require("../../middleware/validator");
const ObjectId = require('mongoose').Types.ObjectId;
module.exports = {
    create: validator({
        body: Joi.object({
            productId: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .required(),
            productVariantIds: Joi.array().items(Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .required())
                .required(),
            combination: Joi.string().required(),
            combinationSlug: Joi.string().required(),
            sku: Joi.string(),
            price: Joi.number().required(),
            quantity: Joi.number().required(),
            unit: Joi.string().required(),
        }),
    }),
    bulkCreate: validator({
        body: Joi.object({
            combinations: Joi.array().items(Joi.object({
                productId: Joi.string()
                    .pattern(/^[0-9a-fA-F]{24}$/)
                    .message("Invalid ID")
                    .required(),
                productVariantIds: Joi.array().items(Joi.string()
                    .pattern(/^[0-9a-fA-F]{24}$/)
                    .message("Invalid ID")
                    .required())
                    .required(),
                combination: Joi.string().required(),
                combinationSlug: Joi.string().required(),
                sku: Joi.string(),
                price: Joi.number().required(),
                quantity: Joi.number().required(),
                unit: Joi.string().required(),
            })).required(),
        }),
    }),

    generate: validator({
        body: Joi.object({
            productId: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .required(),
            variantIds: Joi.array().items(Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .required())
                .required(),
        })
    }),
    update: validator({
        body: Joi.object({
            price: Joi.number(),
            quantity: Joi.number(),
            unit: Joi.string(),
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
            sortOrder: Joi.number(),
            search: Joi.string(),

            _id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .custom((value, helpers) => new ObjectId(value)),
        }),
    }),

};
