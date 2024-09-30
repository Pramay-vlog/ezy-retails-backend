const Joi = require("joi");
const validator = require("../../middleware/validator");
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {

    create: validator({
        body: Joi.object({
            shippingAddressId: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ").required(),
            coupenCode: Joi.string(),
            walletAmount: Joi.number(),
            shippingCharge: Joi.number(),
            paymentId: Joi.string(),
            paymentPlatform: Joi.string(),
            shippingType: Joi.string(),
        }),
    }),


    update: validator({
        body: Joi.object({
            shippingAddressId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/)
            .message("Invalid "),
            orderNumber: Joi.string(),
            orderDate: Joi.date(),
            deliveryDate: Joi.date(),
            totalAmount: Joi.number(),
            taxAmount: Joi.number(),
            coupenCode: Joi.string(),
            discountAmount: Joi.number(),
            walletAmount: Joi.number(),
            shippingCharge: Joi.number(),
            subTotal: Joi.number(),
            paymentId: Joi.string(),
            paymentPlatform: Joi.string(),
            shippingType: Joi.string(),
            trackingNo: Joi.string(),
            trackingUrl: Joi.string(),
            orderStatus: Joi.string().valid("Order Confirmed", "In Progress", "Shipped", "Canceled", "Returned"),
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
