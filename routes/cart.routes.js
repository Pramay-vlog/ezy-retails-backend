const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { constants: { ENUM: { ROLE: { ADMIN } } } } = require("../helpers");
const { CART: { VALIDATOR, APIS } } = require("../controllers");


/* Post Apis */
router.post("/", auth({ usersAllowed: ["*"] }), VALIDATOR.create, APIS.createCart);


/* Get Apis */
router.get("/",auth({ usersAllowed: ["*"] }), VALIDATOR.fetch, APIS.getCart);


/* Patch Apis */
router.patch("/:_id", auth({ usersAllowed: ["*"] }), VALIDATOR.update, APIS.updateCart);
router.delete("/:_id", auth({ usersAllowed: ["*"] }), VALIDATOR.delete, APIS.deleteCart);


module.exports = router;
