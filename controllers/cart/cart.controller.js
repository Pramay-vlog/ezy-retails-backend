const DB = require("../../models");
const { constants: { ENUM: { ROLE: { ADMIN } }, MESSAGE }, response } = require("../../helpers");


/* APIS For Cart */
module.exports = exports = {

    /* Create Cart API */
    createCart: async (req, res) => {

        const cartExists = await DB.CART.findOne({ userId: req.body.userId || req.user._id, productId: req.body.productId }).lean();
        if (cartExists) return response.BAD_REQUEST({ res, message: MESSAGE.ALREADY_EXISTS });
        const productExists = await DB.PRODUCT.findOne({
            _id: req.body.productId,
            isActive: true
        }).lean();
        if (!productExists) return response.BAD_REQUEST({ res, message: MESSAGE.NOT_FOUND });

        const subProductExists = await DB.subProduct.findOne({
            _id: req.body.subProductId,
            isActive: true
        }).lean();
        if (!subProductExists) return response.BAD_REQUEST({ res, message: MESSAGE.NOT_FOUND });


        req.body.userId = req.body.userId || req.user._id;
        await DB.CART.create(req.body);
        return response.OK({ res });

    },


    /* Get Cart API */
    getCart: async (req, res) => {

        let { page, limit, skip, sortBy, sortOrder, search, ...query } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 100;
        sortBy = sortBy || "createdAt";
        sortOrder = sortOrder || -1;

        query = { userId: req.query.userId || req.user._id, ...query };
        search ? query.$or = [{ name: { $regex: search, $options: "i" } }] : ""

        const carts = await DB.CART
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ [sortBy]: sortOrder })
            .lean();

        return response.OK({ res, payload: { count: await DB.CART.countDocuments(query), data: carts } });

    },


    /* Update Cart API*/
    updateCart: async (req, res) => {

        let cartExists = await DB.CART.findOne({ _id: req.params._id, isActive: true }).lean();
        if (!cartExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        await DB.CART.findByIdAndUpdate(req.params._id, req.body, { new: true, });
        return response.OK({ res });

    },


    /* Delete Cart API*/
    deleteCart: async (req, res) => {

        let cartExists = await DB.CART.findOne({ _id: req.params._id }).lean();
        if (!cartExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        await DB.CART.findByIdAndDelete(req.params._id);
        return response.OK({ res });

    },

};
