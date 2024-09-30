const messages = require("../../json/message.json");
const DB = require("../../models");
const { USER_TYPE: { ADMIN } } = require("../../json/enums.json");
const { response } = require("../../helpers");


/* APIS For productVariantCombinations */
module.exports = exports = {
    /* Generate productVariantCombinations API */
    generateProductVariantCombinations: async (req, res) => {
        let { variantIds, productId } = req.body;
        let productVariantCombinations = [];

        console.log("REQ.body " + JSON.stringify(req.body))

        console.log("REQ.body " + req.body)

        /* check product is exists or not */
        let productExists = await DB.PRODUCT.findOne({ _id: productId, isActive: true }).lean();

        console.log("Product " + { _id: productId, isActive: true })
        if (!productExists) return response.NOT_FOUND({ res, message: messages.PRODUCT_NOT_FOUND });

        /* Step0: Check if all variantIds are valid */
        let productVariants = await DB.productVariants.find({ _id: { $in: variantIds } }).lean();
        if (productVariants.length !== variantIds.length) return response.BAD_REQUEST({ res, message: messages.PRODUCT_VARIANTS_NOT_FOUND });

        /* Step1 : Find unique attributes (Color, Size, etc) */
        const uniqueAttributes = [...new Set(productVariants.map((productVariant) => productVariant.attributeId))];

        /* Step2: Create Array of Arrays of arrtibutes wise Variants (color -> ["Black", Blue"], size -> ["S", "M"]) = Result =  [["Black", "Blue"], ["S", "M"] */
        let variants = Object.values(uniqueAttributes.reduce((acc, curr) => {
            acc[curr] = productVariants.filter((productVariant) => productVariant.attributeId.toString() === curr.toString())
            return acc;
        }, {}))

        /* Step3: Generate all possible combinations of variants */
        const generateCombinations = (variants, index, current) => {
            if (index === variants.length) {
                productVariantCombinations.push(current);
                return;
            }
            for (let i = 0; i < variants[index].length; i++) {
                generateCombinations(variants, index + 1, current.concat(variants[index][i]));
            }
        }
        /*
        * invoke the recursive function 
            * WHAT HAPPENS IN RECURSIVE FUNCTION?
             * - POSSIBLE COMBINATIONS ARE GENERATED
        */
        /* 
        * 1st iteration: generateCombinations(variants, 0, [])
        * 2nd iteration: generateCombinations(variants, 1, ["Black"])
        * 3rd iteration: generateCombinations(variants, 2, ["Black", "S"])
        * 4th iteration: generateCombinations(variants, 2, ["Black", "M"])
        * ...
    */
        generateCombinations(variants, 0, []);

        // const existsCombination = []
        const result = []
        /* Step4: Create productVariantCombinations */
        for (let combination of productVariantCombinations) {
            let productVariantIds = combination.map((variant) => variant._id);
            let payload = {
                productId,
                productVariantIds,
                combination: combination.map((variant) => variant.name).join("-"),
                combinationSlug: combination.map((variant) => variant.slug).join("-"),
                sku: "",
                stock: 0,
                actualPrice: 0,
                price: 0,
                discount: 0,
                tax: 0,
                shippingCharge: 0,
                unit: "",
                purchaseVariantOperation: "add"

            }
            //* Pushed exists variant combination
            // const isExistsVariants = await DB.productVariantCombinations.findOne({ productId, productVariantIds: { $all: productVariantIds }, userId: req.user._id, combination: payload.combination, combinationSlug: payload.combinationSlug }).lean();
            // if (isExistsVariants) existsCombination.push(isExistsVariants)
            result.push(payload)
        }

        //* Step 5 : Validatio for exists combination * /
        // if (existsCombination.length) return response.BAD_REQUEST({ res, message: messages.PRODUCT_VARIANT_COMBINATIONS_EXISTS, payload: existsCombination });

        return response.OK({ res, message: messages.PRODUCT_VARIANT_COMBINATIONS_GENERATED_SUCCESSFULLY, payload: { count: result.length, data: result } });
    },

    /* Create productVariantCombinations API */
    // createProductVariantCombinations: async (req, res) => {
    //     req.body.userId = req.user._id;
    //     let { productVariantIds, userId, combination, combinationSlug, productId, } = req.body

    //     //* Validation for exists combination * /
    //     const isExistsVariants = await DB.productVariantCombinations.findOne({ productId, productVariantIds: { $all: productVariantIds }, userId, combination, combinationSlug }).lean();
    //     if (isExistsVariants) return response.BAD_REQUEST({ res, message: messages.PRODUCT_VARIANT_COMBINATIONS_EXISTS });

    //     const productVariantCombinations = await DB.productVariantCombinations.create(req.body);
    //     return response.OK({ res, message: messages.PRODUCT_VARIANT_COMBINATIONS_CREATED_SUCCESSFULLY, payload: productVariantCombinations });

    // },

    // /* Bulk Create productVariantCombinations API */
    // bulkCreateProductVariantCombinations: async (req, res) => {
    //     let { combinations } = req.body;

    //     combinations = combinations.map((combination) => ({ ...combination, userId: req.user._id }));

    //     const existsCombination = []
    //     //* Validation for exists combination * /
    //     for (let comb of combinations) {
    //         let { productVariantIds, userId, combination, combinationSlug, productId, } = comb
    //         const isExistsVariants = await DB.productVariantCombinations.findOne({ productId, productVariantIds: { $all: productVariantIds }, userId, combination, combinationSlug }).lean();
    //         if (isExistsVariants) existsCombination.push(isExistsVariants)
    //     }
    //     if (existsCombination.length) return response.BAD_REQUEST({ res, message: messages.PRODUCT_VARIANT_COMBINATIONS_EXISTS, payload: existsCombination });

    //     const productVariantCombinations = await DB.productVariantCombinations.insertMany(combinations);
    //     return response.OK({ res, message: messages.PRODUCT_VARIANT_COMBINATIONS_CREATED_SUCCESSFULLY, payload: productVariantCombinations });

    // },

    // /* Get productVariantCombinations API */
    // getProductVariantCombinations: async (req, res) => {

    //     let { page, limit, skip, sortBy, sortOrder, search, ...query } = req.query;

    //     page = parseInt(page) || 1;
    //     limit = parseInt(limit) || 100;
    //     sortBy = sortBy || "createdAt";
    //     sortOrder = sortOrder || -1;

    //     query = req.user?.roleId.name === ADMIN ? { ...query } : { isActive: true, ...query };
    //     search ? query.$or = [{ name: { $regex: search, $options: "i" } }] : ""

    //     const productVariantCombinationss = await DB.productVariantCombinations.find(query).sort({ [sortBy]: parseInt(sortOrder) }).skip((page - 1) * limit).limit(limit);

    //     return response.OK({ res, message: messages.PRODUCT_VARIANT_COMBINATIONS_FETCHED_SUCCESSFULLY, payload: { count: await DB.productVariantCombinations.countDocuments(query), data: productVariantCombinationss } });

    // },

    // /* Update productVariantCombinations API*/
    // updateProductVariantCombinations: async (req, res) => {

    //     let productVariantCombinationsExists = await DB.productVariantCombinations.findOne({ _id: req.params._id, isActive: true }).lean();
    //     if (!productVariantCombinationsExists) return response.NOT_FOUND({ res, message: messages.PRODUCT_VARIANT_COMBINATIONS_NOT_FOUND });

    //     await DB.productVariantCombinations.findByIdAndUpdate(req.params._id, req.body, { new: true, });
    //     return response.OK({ res, message: messages.PRODUCT_VARIANT_COMBINATIONS_UPDATED_SUCCESSFULLY, });

    // },


    // /* Delete productVariantCombinations API*/
    // deleteProductVariantCombinations: async (req, res) => {

    //     let productVariantCombinationsExists = await DB.productVariantCombinations.findOne({ _id: req.params._id }).lean();
    //     if (!productVariantCombinationsExists) return response.NOT_FOUND({ res, message: messages.PRODUCT_VARIANT_COMBINATIONS_NOT_FOUND });

    //     await DB.productVariantCombinations.findByIdAndDelete(req.params._id);
    //     return response.OK({ res, message: messages.PRODUCT_VARIANT_COMBINATIONS_DELETED_SUCCESSFULLY });

    // },

};