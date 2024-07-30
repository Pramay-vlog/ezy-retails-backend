const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { constants: { ENUM: { ROLE: { ADMIN } } } } = require("../helpers");
const { WALLET: { VALIDATOR, APIS } } = require("../controllers");


/* Post Apis */
router.post("/", auth({ usersAllowed: [ADMIN] }), VALIDATOR.create, APIS.createWallet);


/* Get Apis */
router.get("/", auth({ usersAllowed: ["*"] }), VALIDATOR.fetch, APIS.getWallet);


/* Patch Apis */
router.patch("/:_id", auth({ usersAllowed: [ADMIN] }), VALIDATOR.update, APIS.updateWallet);
router.delete("/:_id", auth({ usersAllowed: [ADMIN] }), VALIDATOR.toggleActive, APIS.deleteWallet);


module.exports = router;

