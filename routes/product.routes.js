const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { constants: { ENUM: { ROLE: { ADMIN } }, COLORS } } = require("../helpers");
const { PRODUCT: { VALIDATOR, APIS } } = require("../controllers");
const { upload } = require("../service/file/file.upload");

const uploadImages = upload.fields(Object.keys({ ...COLORS, 'images': '', actualPrice: null, price: null }).map(color => ({ name: color, maxCount: 8 })));

/* Post Apis */
router.post("/", auth({ usersAllowed: [ADMIN] }), uploadImages, VALIDATOR.create, APIS.createProduct);


/* Get Apis */
router.get("/", VALIDATOR.fetch, APIS.getProduct);


/* Patch Apis */
router.patch("/:_id", auth({ usersAllowed: [ADMIN] }), uploadImages, VALIDATOR.update, APIS.updateProduct);
router.patch("/toggleActive/:_id", auth({ usersAllowed: [ADMIN] }), VALIDATOR.toggleActive, APIS.toggleActive);

/* Delete APIs */
router.delete("/:_id", auth({ usersAllowed: [ADMIN] }), VALIDATOR.toggleActive, APIS.deleteProduct);


module.exports = router;
