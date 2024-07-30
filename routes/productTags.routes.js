const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { constants: { ENUM: { ROLE: { ADMIN } } } } = require("../helpers");
const { PRODUCTTAGS: { VALIDATOR, APIS } } = require("../controllers");


/* Post Apis */
router.post("/", auth({ usersAllowed: [ADMIN] }), VALIDATOR.create, APIS.createProductTags);


/* Get Apis */
router.get("/", auth({ usersAllowed: ["*"] }), VALIDATOR.fetch, APIS.getProductTags);


/* Patch Apis */
router.patch("/:_id", auth({ usersAllowed: [ADMIN] }), VALIDATOR.update, APIS.updateProductTags);
router.delete("/:_id", auth({ usersAllowed: [ADMIN] }), VALIDATOR.toggleActive, APIS.deleteProductTags);


module.exports = router;
