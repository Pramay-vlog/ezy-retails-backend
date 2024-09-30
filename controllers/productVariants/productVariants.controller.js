const messages = require("../../json/message.json");
const DB = require("../../models");
const { USER_TYPE: { ADMIN } } = require("../../json/enums.json");
const { response } = require("../../helpers");
const { checkItemExists } = require("../../helpers/common.helper");


/* APIS For productVariants */
module.exports = exports = {

    /* Create productVariants API */
    createProductVariants: async (req, res) => {

        //* Convert name to slug    
        req.body.slug = req.body.slug || req.body.name.toLowerCase().replace(/ /g, "-");

        /* check variant is exists or not */
        let variantExists = await checkItemExists({ $or: [{ name: req.body.name }, { slug: req.body.slug }] }, DB.productVariants);
        if (variantExists) return response.BAD_REQUEST({ res, message: messages.PRODUCT_VARIANTS_ALREADY_EXISTS });

        const productVariants = await DB.productVariants.create(req.body);
        return response.OK({ res, message: messages.PRODUCT_VARIANTS_CREATED_SUCCESSFULLY, payload: productVariants });

    },

    /* Get productVariants API */
    getProductVariants: async (req, res) => {

        let { page, limit, skip, sortBy, sortOrder, search, ...query } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 100;
        sortBy = sortBy || "createdAt";
        sortOrder = sortOrder || -1;

        query = req.user?.roleId.name === ADMIN ? { ...query } : { isActive: true, ...query };
        search ? query.$or = [
            { name: { $regex: search, $options: "i" } },
            { slug: { $regex: search, $options: "i" } },
        ] : ""

        const productVariantss = await DB.productVariants.find(query).sort({ [sortBy]: parseInt(sortOrder) }).skip((page - 1) * limit).limit(limit);

        return response.OK({ res, message: messages.PRODUCT_VARIANTS_FETCHED_SUCCESSFULLY, payload: { count: await DB.productVariants.countDocuments(query), data: productVariantss } });

    },

    /* Update productVariants API*/
    updateProductVariants: async (req, res) => {

        //* Convert name to slug
        if (req.body.name) req.body.slug = req.body.slug || req.body.name.toLowerCase().replace(/ /g, "-");

        let productVariantsExists = await DB.productVariants.findOne({ _id: req.params._id, isActive: true }).lean();
        if (!productVariantsExists) return response.NOT_FOUND({ res, message: messages.PRODUCT_VARIANTS_NOT_FOUND });

        await DB.productVariants.findByIdAndUpdate(req.params._id, req.body, { new: true, });
        return response.OK({ res, message: messages.PRODUCT_VARIANTS_UPDATED_SUCCESSFULLY, });

    },


    /* Delete productVariants API*/
    deleteProductVariants: async (req, res) => {

        let productVariantsExists = await DB.productVariants.findOne({ _id: req.params._id }).lean();
        if (!productVariantsExists) return response.NOT_FOUND({ res, message: messages.PRODUCT_VARIANTS_NOT_FOUND });

        await DB.productVariants.findByIdAndDelete(req.params._id);
        return response.OK({ res, message: messages.PRODUCT_VARIANTS_DELETED_SUCCESSFULLY });

    },

};