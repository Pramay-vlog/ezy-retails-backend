const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { constants: { ENUM: { ROLE: { ADMIN } } } } = require("../helpers");
const { FAVORITE: { VALIDATOR, APIS } } = require("../controllers");


/* Post Apis */
router.post("/", auth({ usersAllowed: ["*"] }), VALIDATOR.create, APIS.createFavorite);


/* Get Apis */
router.get("/", VALIDATOR.fetch, APIS.getFavorite);


module.exports = router;
