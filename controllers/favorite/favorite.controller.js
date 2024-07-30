const DB = require("../../models");
const { constants: { ENUM: { ROLE: { ADMIN } }, MESSAGE }, response } = require("../../helpers");


/* APIS For Favorite */
module.exports = exports = {

    /* Create Favorite API */
    createFavorite: async (req, res) => {

        const productExists = await DB.FAVORITE.findOne({ productId: req.body.productId, userId: req.user._id }).lean();
        if (productExists) {
            await DB.FAVORITE.findByIdAndDelete(productExists._id);
            return response.OK({ res });
        } else {
            req.body.userId = req.user._id;
            const favorite = await DB.FAVORITE.create(req.body);
            return response.OK({ res, payload: favorite });
        }

    },


    /* Get Favorite API */
    getFavorite: async (req, res) => {

        let { page, limit, skip, sortBy, sortOrder, search, ...query } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 100;
        sortBy = sortBy || "createdAt";
        sortOrder = sortOrder || -1;

        query = req.user?.roleId.name === ADMIN ? { ...query } : { isActive: true, ...query };

        const favorites = await DB.FAVORITE
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("productId", "name sizes media actualPrice price")
            .sort({ [sortBy]: sortOrder })
            .lean();

        return response.OK({ res, payload: { count: await DB.FAVORITE.countDocuments(query), data: favorites } });

    },

};
