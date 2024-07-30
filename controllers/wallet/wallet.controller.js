const DB = require("../../models");
const { constants: {
    ENUM: { ROLE: { ADMIN } }, MESSAGE },
    response,
    common: { generateCouponCode }
} = require("../../helpers");


/* APIS For Wallet */
module.exports = exports = {

    /* Create Wallet API */
    createWallet: async (req, res) => {

        if (!req.body.name) req.body.name = generateCouponCode()

        const wallet = await DB.WALLET.create(req.body);
        return response.OK({ res, payload: wallet });

    },


    /* Get Wallet API */
    getWallet: async (req, res) => {

        let { page, limit, skip, sortBy, sortOrder, search, ...query } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 100;
        sortBy = sortBy || "createdAt";
        sortOrder = sortOrder || -1;

        query = req.user?.roleId.name === ADMIN ? { ...query } : { isActive: true, ...query };
        search ? query.$or = [{ name: { $regex: search, $options: "i" } }] : ""

        const wallets = await DB.WALLET
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ [sortBy]: sortOrder })
            .lean();

        return response.OK({ res, payload: { count: await DB.WALLET.countDocuments(query), data: wallets } });

    },


    /* Update Wallet API*/
    updateWallet: async (req, res) => {

        let walletExists = await DB.WALLET.findOne({ _id: req.params._id, isActive: true }).lean();
        if (!walletExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        await DB.WALLET.findByIdAndUpdate(req.params._id, req.body, { new: true, });
        return response.OK({ res });

    },


    /* Delete Wallet API*/
    deleteWallet: async (req, res) => {

        let walletExists = await DB.WALLET.findOne({ _id: req.params._id }).lean();
        if (!walletExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        await DB.WALLET.findByIdAndUpdate(req.params._id, { isActive: false, });
        return response.OK({ res });

    },

};
