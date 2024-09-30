const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { USER_TYPE: { ADMIN } } = require("../json/enums.json");
const { PRODUCT_ATTRIBUTE: { VALIDATOR, APIS } } = require("../controllers");


/* Post Apis */
router.post("/", auth({ usersAllowed: [ADMIN] }), VALIDATOR.create, APIS.createProductAttribute);

/* Get Apis */
router.get("/", auth({ usersAllowed: ["*"] }), VALIDATOR.fetch, APIS.getProductAttribute);

/* Put Apis */
router.put("/:_id", auth({ usersAllowed: [ADMIN] }), VALIDATOR.update, APIS.updateProductAttribute);

/* Delete Apis */
router.delete("/:_id", auth({ usersAllowed: [ADMIN] }), VALIDATOR.toggleActive, APIS.deleteProductAttribute);


module.exports = router;