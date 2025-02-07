const Joi = require("joi");
const ObjectId = require('mongoose').Types.ObjectId;
const validator = require("../../middleware/validator");

module.exports = {

    signup: validator({
        body: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            mobile: Joi.string().required(),
            password: Joi.string().when('isSocial', { is: true, then: Joi.optional(), otherwise: Joi.required() }),
            isSocial: Joi.boolean(),
            roleId: Joi.string().required(),
            guestId: Joi.string(),
        }),
    }),


    signIn: validator({
        body: Joi.object({
            email: Joi.string().required(),
            password: Joi.string().when('isSocial', { is: true, then: Joi.optional(), otherwise: Joi.required() }),
            isSocial: Joi.boolean(),
            guestId: Joi.string(),
        }),
    }),

    guestSignIn: validator({
        body: Joi.object({
            guestId: Joi.string().required(),
        }),
    }),

    guestSignUp: validator({
        body: Joi.object({
            guestId: Joi.string().required(),
        }),
    }),
    forgot: validator({
        body: Joi.object({
            email: Joi.string().required(),
        }),
    }),


    verifyOtp: validator({
        body: Joi.object({
            email: Joi.string().required(),
            otp: Joi.string().required(),
        }),
    }),


    resetForgotPassword: validator({
        body: Joi.object({
            password: Joi.string().required(),
        })
    }),


    changePassword: validator({
        body: Joi.object({
            oldPassword: Joi.string().required(),
            newPassword: Joi.string().required(),
        }),
    }),


    update: validator({
        body: Joi.object({
            email: Joi.string(),
            firstName: Joi.string(),
            lastName: Joi.string(),
            mobile: Joi.string(),
        }),
        params: Joi.object({
            _id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
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
            isAll: Joi.boolean(),

            _id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ID")
                .custom((value, helpers) => new ObjectId(value)),
            name: Joi.string(),
            email: Joi.string(),
        }),
    }),

};
