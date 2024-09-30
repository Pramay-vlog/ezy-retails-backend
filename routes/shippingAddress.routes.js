const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { constants: { ENUM: { ROLE: { ADMIN } } } } = require("../helpers");
const { SHIPPING_ADDRESS: { VALIDATOR, APIS } } = require("../controllers");


/* Post Apis */
router.post("/", auth({ usersAllowed: ["*"] }), VALIDATOR.create, APIS.createShippingAddress);


/* Get Apis */
router.get("/", auth({ usersAllowed: ["*"] }), VALIDATOR.fetch, APIS.getShippingAddress);


/* Put Apis */
router.patch("/:_id", auth({ usersAllowed: ["*"] }), VALIDATOR.update, APIS.updateShippingAddress);
router.delete("/:_id", auth({ usersAllowed: ["*"] }), VALIDATOR.toggleActive, APIS.deleteShippingAddress);


module.exports = router;
