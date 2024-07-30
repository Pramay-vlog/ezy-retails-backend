const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { constants: { ENUM: { ROLE: { ADMIN } } } } = require("../helpers");
const { CATEGORY: { VALIDATOR, APIS } } = require("../controllers");
const { upload } = require("../service/file/file.upload");

const uploadImage = upload.single("image");


/* Post Apis */
router.post("/", auth({ usersAllowed: [ADMIN] }), uploadImage, VALIDATOR.create, APIS.createCategory);


/* Get Apis */
router.get("/", auth({ usersAllowed: ["*"] }), VALIDATOR.fetch, APIS.getCategory);


/* Put Apis */
router.patch("/:_id", auth({ usersAllowed: [ADMIN] }), uploadImage, VALIDATOR.update, APIS.updateCategory);
router.delete("/:_id", auth({ usersAllowed: [ADMIN] }), VALIDATOR.toggleActive, APIS.deleteCategory);


module.exports = router;
