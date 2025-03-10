const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { constants: { ENUM: { ROLE: { ADMIN } } } } = require("../helpers");
const { HEROSECTION: { VALIDATOR, APIS } } = require("../controllers");
const { upload } = require("../service/file/file.upload");

const uploadImage = upload.single("image");

/* Post Apis */
router.post("/", auth({ usersAllowed: [ADMIN] }), uploadImage, VALIDATOR.create, APIS.createHeroSection);


/* Get Apis */
router.get("/", auth({ isTokenRequired: false, usersAllowed: ["*"] }), VALIDATOR.fetch, APIS.getHeroSection);


/* Put Apis */
router.patch("/:_id", auth({ usersAllowed: [ADMIN] }), uploadImage, VALIDATOR.update, APIS.updateHeroSection);
router.delete("/:_id", auth({ usersAllowed: [ADMIN] }), VALIDATOR.toggleActive, APIS.deleteHeroSection);


module.exports = router;
