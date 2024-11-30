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

};