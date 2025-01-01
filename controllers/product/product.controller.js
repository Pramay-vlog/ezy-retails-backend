const DB = require("../../models");
const { constants: { ENUM: { ROLE: { ADMIN }, COUNT_MODULES }, MESSAGE, COLORS }, response } = require("../../helpers");


/* APIS For Product */
module.exports = exports = {

    /* Create Product API */
    createProduct: async (req, res) => {

        const subCategoryExists = await DB.SUBCATEGORY.findOne({ _id: req.body.subCategoryId, isActive: true }).lean();
        if (!subCategoryExists) return response.NOT_FOUND({ res, message: "Sub Category " + MESSAGE.NOT_FOUND });
        const categoryExists = await DB.CATEGORY.findOne({ _id: req.body.categoryId, isActive: true }).lean();
        if (!categoryExists) return response.NOT_FOUND({ res, message: "Category " + MESSAGE.NOT_FOUND });

        req.body.categoryId = subCategoryExists.categoryId;
        req.body.discount = req.body.discount || (req.body.actualPrice - req.body.price) / req.body.actualPrice * 100;

        const product = await DB.PRODUCT.create(req.body);
        await DB.DATA_COUNT.findOneAndUpdate({ module: COUNT_MODULES.PRODUCT }, { $inc: { count: 1 } }, { upsert: true });

        //if variants are there then create subproducts
        try {
            if (req.body.variants) {
                let subProducts = [];
                for (let variant of req.body.variants) {
                    let subProduct = {
                        ...variant,
                        name: product.name,
                        productId: product._id,
                        discount: (variant.discount && variant.discount > 0) ? ((variant.actualPrice - variant.price) / (variant.actualPrice * 100)) : 0
                    };
                    subProducts.push(subProduct);
                }
                await DB.subProduct.insertMany(subProducts);
            }
        } catch (error) {
            console.log(error);
            // if we get error in creating subproducts then delete the product
            await DB.PRODUCT.findByIdAndDelete(product._id);
            return response.BAD_REQUEST({ res, message: error.message });
        }

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

        const products = await DB.PRODUCT.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "SubProduct",
                    localField: "_id",
                    foreignField: "productId",
                    as: "variants"
                }
            },
            {
                $lookup: {
                    from: "ProductTags",
                    localField: "productTags",
                    foreignField: "_id",
                    as: "productTags"
                },
            },
            {
                $lookup: {
                    from: "Category",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category"
                },
            },
            {
                $unwind: "$category"
            },
            {
                $lookup: {
                    from: "Subcategory",
                    localField: "subCategoryId",
                    foreignField: "_id",
                    as: "subCategory"
                },
            },
            {
                $unwind: "$subCategory",
            },
            {
                $project: {
                    name: 1,
                    images: 1,
                    features: 1,
                    description: 1,
                    category: 1,
                    subCategory: 1,
                    productTags: 1,
                    stock: 1,
                    actualPrice: 1,
                    price: 1,
                    discount: 1,
                    state: 1,
                    tax: 1,
                    shippingCharge: 1,
                    variants: {
                        $filter: {
                            input: "$variants",
                            as: "variant",
                            cond: { $eq: ["$$variant.isActive", true] }
                        }
                    }
                }
            },
            { $sort: { [sortBy]: parseInt(sortOrder) } },
            { $skip: (parseInt(page) - 1) * parseInt(limit) },
            { $limit: parseInt(limit) }
        ]);

        return response.OK({ res, payload: { count: await DB.PRODUCT.countDocuments(query), data: products } });

    },


    /* Update Product API*/
    updateProduct: async (req, res) => {
        let productExists = await DB.PRODUCT.findOne({ _id: req.params._id, isActive: true }).lean();
        if (!productExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

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

        //if variants are there then update subproducts
        try {
            if (req.body.variants) {
                for (let { subProductOperation, ...variant } of req.body.variants) {
                    if (subProductOperation === 'update') {
                        if (!variant._id) return response.BAD_REQUEST({ res, message: "_id is required" });
                        if (!(await DB.subProduct.findById(variant._id))) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

                    } else if (subProductOperation === 'delete') {
                        if (!variant._id) return response.BAD_REQUEST({ res, message: "_id is required" });
                        if (!(await DB.subProduct.findById(variant._id))) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });
                    }
                }
                for (let { subProductOperation, ...variant } of req.body.variants) {
                    if (subProductOperation === 'update') {
                        if (!variant._id) return response.BAD_REQUEST({ res, message: "_id is required" });
                        let subProduct = {
                            ...variant,
                            name: productExists.name,
                            productId: productExists._id,
                            discount: (variant.discount && variant.discount > 0) ? ((variant.actualPrice - variant.price) / (variant.actualPrice * 100)) : 0
                        };
                        await DB.subProduct.findByIdAndUpdate(variant._id, subProduct, { new: true });

                    } else if (subProductOperation === 'delete') {
                        if (!variant._id) return response.BAD_REQUEST({ res, message: "_id is required" });
                        await DB.subProduct.findByIdAndDelete(variant._id);
                    } else if (subProductOperation === 'add') {
                        let subProduct = {
                            ...variant,
                            name: productExists.name,
                            productId: productExists._id,
                            discount: (variant.discount && variant.discount > 0) ? ((variant.actualPrice - variant.price) / (variant.actualPrice * 100)) : 0
                        };
                        await DB.subProduct.create(subProduct);
                    } else {
                        return response.BAD_REQUEST({ res, message: "Invalid Operation" });
                    }
                }
            }
        } catch (error) {
            console.log(error);
            return response.BAD_REQUEST({ res, message: error.message });
        }
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
