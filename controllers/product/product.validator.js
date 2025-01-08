const Joi = require("joi");
const validator = require("../../middleware/validator");
const ObjectId = require('mongoose').Types.ObjectId;
const { constants: { ENUM: { PRODUCT_STATE, SIZES } } } = require("../../helpers");
const { subProduct } = require("../../models");

module.exports = {

    create: validator({
        body: Joi.object({
            name: Joi.string().required(),
            productTags: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)),
            features: Joi.string().required(),
            description: Joi.object({
                about: Joi.string().required(),
                material: Joi.string().required(),
                care: Joi.string().required(),
            }),
            subCategoryId: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .required(),
            stock: Joi.number().required().min(0),
            actualPrice: Joi.number().required(),
            price: Joi.number().required(),
            discount: Joi.number().default(0),
            tax: Joi.number().default(0),
            shippingCharge: Joi.number().default(0),
            state: Joi.string().valid(PRODUCT_STATE.IN_STOCK, PRODUCT_STATE.OUT_OF_STOCK),
            variants : Joi.array().items(Joi.object({
                images: Joi.array().items(Joi.string()).required(),
                combination: Joi.string().required(),
                combinationSlug: Joi.string().required(),
                productVariantIds: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)),
                sku: Joi.string().allow(""),
                stock: Joi.number().required().min(0),
                actualPrice: Joi.number().required(),
                price: Joi.number().required(),
                discount: Joi.number().default(0),
                tax: Joi.number().default(0),
                shippingCharge: Joi.number().default(0),
                state: Joi.string().valid(PRODUCT_STATE.IN_STOCK, PRODUCT_STATE.OUT_OF_STOCK),
            }))
        })
            .custom((value) => {
                if (value.stock <= 0) value.state = PRODUCT_STATE.OUT_OF_STOCK;
                else value.state = PRODUCT_STATE.IN_STOCK;
                return value;
            })
            .unknown(true),
    }),


    update: validator({
        body: Joi.object({
            name: Joi.string().trim(),
            sizes: Joi.string()
                .custom((value, helpers) => {
                    const sizes = value.split(",");
                    for (let size of sizes) {
                        if (!SIZES.includes(size)) return helpers.error("Invalid size");
                    }
                    return sizes;
                }),
            productTags: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)),  
            features: Joi.string(),
            about: Joi.string().trim(),
            material: Joi.string().trim(),
            care: Joi.string().trim(),
            categoryId: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID"),
            subCategoryId: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID"),
            stock: Joi.number().min(0),
            actualPrice: Joi.number(),
            price: Joi.number(),
            tax: Joi.number(),
            shippingCharge: Joi.number(),
            state: Joi.string().valid(PRODUCT_STATE.IN_STOCK, PRODUCT_STATE.OUT_OF_STOCK),
            variants : Joi.array().items(Joi.object({
                _id: Joi.string()
                    .pattern(/^[0-9a-fA-F]{24}$/)
                    .message("Invalid ID"),
                images: Joi.array().items(Joi.string()).required(),
                combination: Joi.string().required(),
                combinationSlug: Joi.string().required(),
                productVariantIds: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)),
                sku: Joi.string(),
                stock: Joi.number().min(0),
                actualPrice: Joi.number(),
                price: Joi.number(),
                discount: Joi.number(),
                tax: Joi.number(),
                shippingCharge: Joi.number(),
                state: Joi.string().valid(PRODUCT_STATE.IN_STOCK, PRODUCT_STATE.OUT_OF_STOCK),
                subProductOperation: Joi.string().valid('add', 'update', 'delete').required()
            }))
        })
            .custom((value) => {
                if (value.stock <= 0) value.state = PRODUCT_STATE.OUT_OF_STOCK;
                else value.state = PRODUCT_STATE.IN_STOCK;
                return value;
            })
            .unknown(true),
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
            sortOrder: Joi.string().valid('1', '-1').default('-1'),
            search: Joi.string(),

            _id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .custom((value) => new ObjectId(value)),
            categoryId: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .custom((value) => new ObjectId(value)),
            subCategoryId: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .custom((value) => new ObjectId(value)),
            name: Joi.string().trim(),
            sizes: Joi.string().trim().uppercase(),
            productTags: Joi.string().trim(),
            minPrice: Joi.number().min(1),
            maxPrice: Joi.number().min(2),
            minDiscount: Joi.number().min(0).max(100),
            maxDiscount: Joi.number().min(1).max(100),
        })
    }),

};
