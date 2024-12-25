const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { USER_TYPE: { ADMIN } } = require("../json/enums.json");
const { PRODUCT_VARIANTS: { VALIDATOR, APIS } } = require("../controllers");


/* Post Apis */
router.post("/", auth({ usersAllowed: [ADMIN] }), VALIDATOR.create, APIS.createProductVariants);

/* Get Apis */
router.get("/", VALIDATOR.fetch, APIS.getProductVariants);

/* Put Apis */
router.put("/:_id", auth({ usersAllowed: [ADMIN] }), VALIDATOR.update, APIS.updateProductVariants);

/* Delete Apis */
router.delete("/:_id", auth({ usersAllowed: [ADMIN] }), VALIDATOR.toggleActive, APIS.deleteProductVariants);


module.exports = router;