const DB = require("../../models");
const { constants: { ENUM: { ROLE: { ADMIN }, COUNT_MODULES }, MESSAGE }, response } = require("../../helpers");


/* APIS For Subcategory */
module.exports = exports = {

    /* Create Subcategory API */
    createSubcategory: async (req, res) => {

        if (!await DB.CATEGORY.findOne({ _id: req.body.categoryId, isActive: true })) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        const subcategory = await DB.SUBCATEGORY.create(req.body);
        await DB.DATA_COUNT.findOneAndUpdate({ module: COUNT_MODULES.SUB_CATEGORY }, { $inc: { count: 1 } }, { upsert: true });
        return response.OK({ res, payload: subcategory });

    },


    /* Get Subcategory API */
    getSubcategory: async (req, res) => {

        let { page, limit, skip, sortBy, sortOrder, search, ...query } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 100;
        sortBy = sortBy || "createdAt";
        sortOrder = sortOrder || -1;

        query = req.user?.roleId.name === ADMIN ? { ...query } : { isActive: true, ...query };
        search ? query.$or = [{ name: { $regex: search, $options: "i" } }] : ""

        const subcategorys = await DB.SUBCATEGORY
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ [sortBy]: sortOrder })
            .populate("categoryId", "name")
            .lean();

        return response.OK({ res, payload: { count: await DB.SUBCATEGORY.countDocuments(query), data: subcategorys } });

    },


    /* Update Subcategory API*/
    updateSubcategory: async (req, res) => {

        let subcategoryExists = await DB.SUBCATEGORY.findOne({ _id: req.params._id, isActive: true }).lean();
        if (!subcategoryExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        await DB.SUBCATEGORY.findByIdAndUpdate(req.params._id, req.body, { new: true, });
        return response.OK({ res });

    },


    /* Delete Subcategory API*/
    deleteSubcategory: async (req, res) => {

        let subcategoryExists = await DB.SUBCATEGORY.findOne({ _id: req.params._id }).lean();
        if (!subcategoryExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        await DB.SUBCATEGORY.findByIdAndUpdate(req.params._id, { isActive: false, });
        await DB.DATA_COUNT.findOneAndUpdate({ module: COUNT_MODULES.SUB_CATEGORY }, { $inc: { count: -1 } }, { upsert: true });
        return response.OK({ res });

    },

};
