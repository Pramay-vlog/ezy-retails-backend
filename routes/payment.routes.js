const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { constants: { ENUM: { ROLE: { ADMIN } } } } = require("../helpers");
const { PAYMENT: { VALIDATOR, APIS } } = require("../controllers");


/* Post Apis */
router.post("/create-checkout-session", auth({ usersAllowed: ["*"] }), VALIDATOR.create, APIS.createCheckoutSession);

router.post("/payment/webhook", require("body-parser").raw({ type: "application/json" }), APIS.handleWebhook);


module.exports = router;
