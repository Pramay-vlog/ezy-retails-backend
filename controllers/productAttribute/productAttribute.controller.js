const messages = require("../../json/message.json");
const DB = require("../../models");
const { USER_TYPE: { ADMIN } } = require("../../json/enums.json");
const { response } = require("../../helpers");


/* APIS For productAttribute */
module.exports = exports = {

    /* Create productAttribute API */
    createProductAttribute: async (req, res) => {

        //* Convert name to slug    
        req.body.slug = req.body.slug || req.body.name.toLowerCase().replace(/ /g, "-");

        const productAttribute = await DB.productAttribute.create(req.body);
        return response.OK({ res, message: messages.PRODUCT_ATTRIBUTE_CREATED_SUCCESSFULLY, payload: productAttribute });

    },

    /* Get productAttribute API */
    getProductAttribute: async (req, res) => {

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

        const productAttributes = await DB.productAttribute.find(query).sort({ [sortBy]: parseInt(sortOrder) }).skip((page - 1) * limit).limit(limit);

        return response.OK({ res, message: messages.PRODUCT_ATTRIBUTE_FETCHED_SUCCESSFULLY, payload: { count: await DB.productAttribute.countDocuments(query), data: productAttributes } });

    },

    /* Update productAttribute API*/
    updateProductAttribute: async (req, res) => {

        //* Convert name to slug
        if (req.body.name) req.body.slug = req.body.slug || req.body.name.toLowerCase().replace(/ /g, "-");

        let productAttributeExists = await DB.productAttribute.findOne({ _id: req.params._id, isActive: true }).lean();
        if (!productAttributeExists) return response.NOT_FOUND({ res, message: messages.PRODUCT_ATTRIBUTE_NOT_FOUND });

        await DB.productAttribute.findByIdAndUpdate(req.params._id, req.body, { new: true, });
        return response.OK({ res, message: messages.PRODUCT_ATTRIBUTE_UPDATED_SUCCESSFULLY, });

    },


    /* Delete productAttribute API*/
    deleteProductAttribute: async (req, res) => {

        let productAttributeExists = await DB.productAttribute.findOne({ _id: req.params._id }).lean();
        if (!productAttributeExists) return response.NOT_FOUND({ res, message: messages.PRODUCT_ATTRIBUTE_NOT_FOUND });

        await DB.productAttribute.findByIdAndDelete(req.params._id);
        await DB.productVariants.deleteMany({ attributeId: req.params._id });
        return response.OK({ res, message: messages.PRODUCT_ATTRIBUTE_DELETED_SUCCESSFULLY });

    },

};