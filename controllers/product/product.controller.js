const DB = require("../../models");
const { constants: { ENUM: { ROLE: { ADMIN }, COUNT_MODULES }, MESSAGE, COLORS }, response } = require("../../helpers");


/* APIS For Product */
module.exports = exports = {

    /* Create Product API */
    createProduct: async (req, res) => {

        const subCategoryExists = await DB.SUBCATEGORY.findOne({ _id: req.body.subCategoryId, isActive: true }).lean();
        if (!subCategoryExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        req.body.media = [];
        for (let element in req.files) {
            if (element === 'images') {
                req.body.media.push({
                    color: null,
                    images: req.files[element].map(file => file.location)
                })
            } else {
                req.body.media.push({
                    color: element,
                    images: req.files[element].map(file => file.location),
                    actualPrice: req.body[element]?.actualPrice,
                    price: req.body[element]?.price,
                    discount: req.body.discount || (req.body[element]?.actualPrice - req.body[element]?.price) / req.body[element]?.actualPrice * 100
                })
            }
        }

        req.body.categoryId = subCategoryExists.categoryId;
        req.body.description = {
            about: req.body.about,
            material: req.body.material,
            care: req.body.care,
        }
        req.body.discount = req.body.discount || (req.body.actualPrice - req.body.price) / req.body.actualPrice * 100;

        const product = await DB.PRODUCT.create(req.body);
        await DB.DATA_COUNT.findOneAndUpdate({ module: COUNT_MODULES.PRODUCT }, { $inc: { count: 1 } }, { upsert: true });
        return response.OK({ res, payload: product });

    },


    /* Get Product API */
    getProduct: async (req, res) => {

        let { page, limit, skip, sortBy, sortOrder, search, sizes, productTags, minPrice, maxPrice, minDiscount, maxDiscount, ...query } = req.query;

        query = req.user?.roleId.name === ADMIN ? { ...query } : { isActive: true, ...query };
        search ? query.$or = [{ name: { $regex: search, $options: "i" } }] : "";

        if (sizes) {
            sizes = sizes.split(",");
            query.sizes = { $in: sizes };
        }
        if (productTags) {
            productTags = productTags.split(",");
            query.productTags = { $in: productTags };
        }

        if (minPrice && maxPrice) {
            query.$or = [
                { price: { $gte: minPrice, $lte: maxPrice } },
                { 'media.0.price': { $gte: minPrice, $lte: maxPrice } }
            ];
        } else {
            if (minPrice) {
                query.$or = [
                    { price: { $gte: minPrice } },
                    { 'media.0.price': { $gte: minPrice } }
                ];
            }
            if (maxPrice) {
                query.$or = [
                    { price: { $lte: maxPrice } },
                    { 'media.0.price': { $lte: maxPrice } }
                ];
            }
        }

        if (minDiscount && maxDiscount) {
            query.$or = [
                { discount: { $gte: minDiscount, $lte: maxDiscount } },
                { 'media.0.discount': { $gte: minDiscount, $lte: maxDiscount } }
            ];
        } else {
            if (minDiscount) {
                query.$or = [
                    { discount: { $gte: minDiscount } },
                    { 'media.0.discount': { $gte: minDiscount } }
                ];
            }
            if (maxDiscount) {
                query.$or = [
                    { discount: { $lte: maxDiscount } },
                    { 'media.0.discount': { $lte: maxDiscount } }
                ];
            }
        }

        const products = await DB.PRODUCT
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ [sortBy]: sortOrder })
            .lean();

        return response.OK({ res, payload: { count: await DB.PRODUCT.countDocuments(query), data: products } });

    },


    /* Update Product API*/
    updateProduct: async (req, res) => {
        let productExists = await DB.PRODUCT.findOne({ _id: req.params._id, isActive: true }).lean();
        if (!productExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        if (Object.keys(req?.files).length) {
            let media = []
            for (let element in req.files) {
                if (element === 'images') {
                    media.push({
                        color: null,
                        images: req.files[element].map(file => file.location)
                    })
                } else {
                    media.push({
                        color: element,
                        images: req.files[element].map(file => file.location),
                        actualPrice: req.body[element]?.actualPrice,
                        price: req.body[element]?.price,
                        ...(
                            req.body[element]?.discount && {
                                discount: req.body.discount
                            } ||
                            req.body[element]?.actualPrice &&
                            req.body[element]?.price &&
                            !req.body[element]?.discount && {
                                discount: (req.body[element]?.actualPrice - req.body[element]?.price) / req.body[element]?.actualPrice * 100
                            })
                    })
                }
            }
            req.body.media = media;
        }

        let colorKey = Object.keys(COLORS).join('|');
        if (!Object.keys(req?.files).length && Object.keys(req.body).some(key => new RegExp(`^(${colorKey})$`).test(key))) {
            let media = productExists.media;
            let colorField = Object.keys(req.body).filter(key => new RegExp(`^(${colorKey})$`).test(key))
            media = media.map((element, i) => {
                if (colorField.includes(element.color)) {
                    let x = req.body[element.color]?.discount || (
                        (req.body[element.color]?.actualPrice || element.actualPrice) -
                        (req.body[element.color]?.price || element.price)
                    ) / (req.body[element.color]?.actualPrice || element.actualPrice) * 100;
                    element.actualPrice = req.body[element.color]?.actualPrice || element.actualPrice;
                    element.price = req.body[element.color]?.price || element.price;
                    element.discount = req.body[element.color]?.discount || (
                        (req.body[element.color]?.actualPrice || element.actualPrice) -
                        (req.body[element.color]?.price || element.price)
                    ) / (req.body[element.color]?.actualPrice || element.actualPrice) * 100;
                }
                return element;
            });
            req.body.media = media;
        }

        if (req.body.categoryId) {
            if (!req.body.subCategoryId) return response.BAD_REQUEST({ res, message: MESSAGE.NOT_FOUND });
            if (!await DB.CATEGORY.findOne({ _id: req.body.categoryId, isActive: true }).lean()) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });
            if (!await DB.SUBCATEGORY.findOne({ _id: req.body.subCategoryId, categoryId: req.body.categoryId, isActive: true }).lean()) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });
        }

        if (req.body.about || req.body.material || req.body.care) req.body.description = {
            about: req.body.about || productExists.description.about,
            material: req.body.material || productExists.description.material,
            care: req.body.care || productExists.description.care,
        };

        if (req.body.actualPrice || req.body.price) req.body.discount = req.body.discount || (
            (req.body.actualPrice || productExists.actualPrice) -
            (req.body.price || productExists.price)
        ) / (req.body.actualPrice || productExists.actualPrice) * 100;

        await DB.PRODUCT.findByIdAndUpdate(req.params._id, req.body, { new: true });
        return response.OK({ res });

    },


    /* Delete Product API*/
    deleteProduct: async (req, res) => {

        let productExists = await DB.PRODUCT.findOne({ _id: req.params._id }).lean();
        if (!productExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        await DB.PRODUCT.findByIdAndUpdate(req.params._id, { isActive: false, });
        await DB.DATA_COUNT.findOneAndUpdate({ module: COUNT_MODULES.PRODUCT }, { $inc: { count: -1 } }, { upsert: true });
        return response.OK({ res });

    },

    /* Toggle Active/Deactive API */
    toggleActive: async (req, res) => {

        let productExists = await DB.PRODUCT.findOne({ _id: req.params._id }).lean();
        if (!productExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        await DB.PRODUCT.findByIdAndUpdate(req.params._id, { isActive: !productExists.isActive });
        await DB.DATA_COUNT.findOneAndUpdate(
            { module: COUNT_MODULES.PRODUCT },
            { $inc: { count: productExists.isActive ? -1 : 1 } },
            { upsert: true }
        );
        return response.OK({ res });

    },

};
