const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { USER_TYPE: { ADMIN } } = require("../json/enums.json");
const { PRODUCT_VARIANT_COMBINATIONS: { VALIDATOR, APIS } } = require("../controllers");


/* Post Apis */
// router.post("/", auth({ usersAllowed: [ADMIN] }), VALIDATOR.create, APIS.createProductVariantCombinations);
// router.post("/bulk-create", auth({ usersAllowed: [ADMIN] }), VALIDATOR.bulkCreate, APIS.bulkCreateProductVariantCombinations);
router.post("/generate", auth({ usersAllowed: [ADMIN] }), VALIDATOR.generate, APIS.generateProductVariantCombinations);
/* Get Apis */
// router.get("/", auth({ usersAllowed: ["*"] }), VALIDATOR.fetch, APIS.getProductVariantCombinations);

// /* Put Apis */
// router.put("/:_id", auth({ usersAllowed: [ADMIN] }), VALIDATOR.update, APIS.updateProductVariantCombinations);

// /* Delete Apis */
// router.delete("/:_id", auth({ usersAllowed: [ADMIN] }), VALIDATOR.toggleActive, APIS.deleteProductVariantCombinations);


module.exports = router;
