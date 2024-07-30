const DB = require("../../models");
const { constants: { ENUM: { ROLE: { ADMIN }, COUNT_MODULES }, MESSAGE }, response } = require("../../helpers");
const { deleteFile } = require("../../service/file/file.upload");
const { CATEGORY } = require("./category.aggregate")

/* APIS For Category */
module.exports = exports = {

    /* Create Category API */
    createCategory: async (req, res) => {

        req.body.image = req.file?.location;
        const category = await DB.CATEGORY.create(req.body);
        await DB.DATA_COUNT.findOneAndUpdate({ module: COUNT_MODULES.CATEGORY }, { $inc: { count: 1 } }, { upsert: true });
        return response.OK({ res, payload: category });

    },


    /* Get Category API */
    getCategory: async (req, res) => {

        let { page, limit, skip, sortBy, sortOrder, search, ...query } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 100;
        sortBy = sortBy || "createdAt";
        sortOrder = sortOrder || -1;

        query = req.user?.roleId.name === ADMIN ? { ...query } : { isActive: true, ...query };
        search ? query.$or = [{ name: { $regex: search, $options: "i" } }] : "";
        const categories = await DB.CATEGORY.aggregate([{ '$match': query }, ...CATEGORY])
        return response.OK({ res, payload: { data: categories } });

    },


    /* Update Category API*/
    updateCategory: async (req, res) => {

        let categoryExists = await DB.CATEGORY.findOne({ _id: req.params._id, isActive: true }).lean();
        if (!categoryExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        if (req.file?.location) {
            deleteFile(categoryExists.image);
            req.body.image = req.file.location;
        }

        await DB.CATEGORY.findByIdAndUpdate(req.params._id, req.body, { new: true, });
        return response.OK({ res });

    },


    /* Delete Category API*/
    deleteCategory: async (req, res) => {

        let categoryExists = await DB.CATEGORY.findOne({ _id: req.params._id }).lean();
        if (!categoryExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        deleteFile(categoryExists.image);

        const removeSubCats = await DB.SUBCATEGORY.updateMany({ categoryId: req.params._id }, { isActive: false, });
        const removeProducts = await DB.PRODUCT.updateMany({ categoryId: req.params._id }, { isActive: false, });

        /* Update Counts */
        await DB.DATA_COUNT.findOneAndUpdate({ module: COUNT_MODULES.CATEGORY }, { $inc: { count: -1 } }, { upsert: true });
        await DB.DATA_COUNT.findOneAndUpdate({ module: COUNT_MODULES.SUB_CATEGORY }, { $inc: { count: -removeSubCats.modifiedCount } }, { upsert: true });
        await DB.DATA_COUNT.findOneAndUpdate({ module: COUNT_MODULES.PRODUCT }, { $inc: { count: -removeProducts.modifiedCount } }, { upsert: true });

        await DB.CATEGORY.findByIdAndUpdate(req.params._id, { isActive: false, });
        return response.OK({ res });

    },

};
