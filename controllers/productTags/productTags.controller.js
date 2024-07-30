const DB = require("../../models");
const { constants: { ENUM: { ROLE: { ADMIN } }, MESSAGE }, response } = require("../../helpers");


/* APIS For ProductTags */
module.exports = exports = {

    /* Create ProductTags API */
    createProductTags: async (req, res) => {

        const productTags = await DB.PRODUCTTAGS.create(req.body);
        return response.OK({ res, payload: productTags });

    },


    /* Get ProductTags API */
    getProductTags: async (req, res) => {

        let { page, limit, skip, sortBy, sortOrder, search, ...query } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 100;
        sortBy = sortBy || "createdAt";
        sortOrder = sortOrder || -1;

        query = req.user?.roleId.name === ADMIN ? { ...query } : { isActive: true, ...query };
        search ? query.$or = [{ name: { $regex: search, $options: "i" } }] : ""

        const productTagss = await DB.PRODUCTTAGS
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ [sortBy]: sortOrder })
            .lean();

        return response.OK({ res, payload: { count: await DB.PRODUCTTAGS.countDocuments(query), data: productTagss } });

    },


    /* Update ProductTags API*/
    updateProductTags: async (req, res) => {

        let productTagsExists = await DB.PRODUCTTAGS.findOne({ _id: req.params._id, isActive: true }).lean();
        if (!productTagsExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        await DB.PRODUCTTAGS.findByIdAndUpdate(req.params._id, req.body, { new: true, });
        return response.OK({ res });

    },


    /* Delete ProductTags API*/
    deleteProductTags: async (req, res) => {

        let productTagsExists = await DB.PRODUCTTAGS.findOne({ _id: req.params._id }).lean();
        if (!productTagsExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        await DB.PRODUCTTAGS.findByIdAndUpdate(req.params._id, { isActive: false, });
        return response.OK({ res });

    },

};
