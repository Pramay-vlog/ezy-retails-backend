const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { constants: { ENUM: { ROLE: { ADMIN } } } } = require("../helpers");
const { SUBCATEGORY: { VALIDATOR, APIS } } = require("../controllers");


/* Post Apis */
router.post("/", auth({ usersAllowed: [ADMIN] }), VALIDATOR.create, APIS.createSubcategory);


/* Get Apis */
router.get("/", auth({ usersAllowed: ["*"] }), VALIDATOR.fetch, APIS.getSubcategory);


/* Put Apis */
router.patch("/:_id", auth({ usersAllowed: [ADMIN] }), VALIDATOR.update, APIS.updateSubcategory);
router.delete("/:_id", auth({ usersAllowed: [ADMIN] }), VALIDATOR.toggleActive, APIS.deleteSubcategory);


module.exports = router;

