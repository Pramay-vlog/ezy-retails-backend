const DB = require("../../models");
const { constants: { ENUM: { ROLE: { ADMIN }, COUNT_MODULES }, MESSAGE }, response } = require("../../helpers");
const { deleteFile } = require("../../service/file/file.upload");

/* APIS For ShippingAddress */
module.exports = exports = {

    /* Create ShippingAddress API */
    createShippingAddress: async (req, res) => {
        const isShippingAddressExists = await DB.SHIPPING_ADDRESS.findOne({ userId: req.user._id });
        if (!isShippingAddressExists) req.body.isDefault = true
        req.body.userId = req.user._id

        const shippingAddress = await DB.SHIPPING_ADDRESS.create(req.body);
        return response.OK({ res, payload: shippingAddress });

    },


    /* Get ShippingAddress API */
    getShippingAddress: async (req, res) => {

        let { page, limit, skip, sortBy, sortOrder, search, ...query } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 100;
        sortBy = sortBy || "createdAt";
        sortOrder = sortOrder || -1;

        query = req.user?.roleId.name === ADMIN ? { ...query } : { isActive: true, ...query };
        search ? query.$or = [{ title: { $regex: search, $options: "i" } }] : "";
        const shippingAddresses = await DB.SHIPPING_ADDRESS.find({ userId: req.user._id })
        return response.OK({ res, payload: { data: shippingAddresses } });

    },


    /* Update ShippingAddress API*/
    updateShippingAddress: async (req, res) => {

        const shippingAddress = await DB.SHIPPING_ADDRESS.findById(req.params._id);
        if (!shippingAddress) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        let data = await DB.SHIPPING_ADDRESS.findByIdAndUpdate(req.params._id, req.body, { new: true });

        await DB.SHIPPING_ADDRESS.updateMany(
            { _id: { $ne: req.params._id }, userId: req.user._id },
            { isDefault: false }
        );
        return response.OK({ res });

    },


    /* Delete ShippingAddress API*/
    deleteShippingAddress: async (req, res) => {

        let shippingAddressExists = await DB.SHIPPING_ADDRESS.findOne({ _id: req.params._id }).lean();
        if (!shippingAddressExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        await DB.SHIPPING_ADDRESS.findByIdAndDelete(req.params._id, { isActive: false, });
        return response.OK({ res });

    },

};
