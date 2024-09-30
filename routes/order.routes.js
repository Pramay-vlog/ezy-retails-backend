const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { constants: { ENUM: { ROLE: { ADMIN } } } } = require("../helpers");
const { ORDER: { VALIDATOR, APIS } } = require("../controllers");


/* Post Apis */
router.post("/", auth({ usersAllowed: ["*"] }), VALIDATOR.create, APIS.createOrder);


/* Get Apis */
router.get("/", auth({ usersAllowed: ["*"] }), VALIDATOR.fetch, APIS.getOrder);
router.get("/items", auth({ usersAllowed: ["*"] }), VALIDATOR.fetch, APIS.getOrderWithItems);


/* Put Apis */
router.patch("/:_id", auth({ usersAllowed: ["*"] }), VALIDATOR.update, APIS.updateOrder);
router.delete("/:_id", auth({ usersAllowed: ["*"] }), VALIDATOR.toggleActive, APIS.deleteOrder);


module.exports = router;
