const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { constants: { ENUM: { ROLE: { ADMIN } } } } = require("../helpers");
const { LOCATION: { VALIDATOR, APIS } } = require("../controllers");


/* Post Apis */
router.post("/", auth({ usersAllowed: ["*"] }), VALIDATOR.create, APIS.createLocation);


/* Get Apis */
router.get("/", auth({ usersAllowed: ["*"] }), VALIDATOR.fetch, APIS.getLocation);


/* Patch Apis */
router.patch("/:_id", auth({ usersAllowed: ["*"] }), VALIDATOR.update, APIS.updateLocation);
router.delete("/:_id", auth({ usersAllowed: ["*"] }), VALIDATOR.toggleActive, APIS.deleteLocation);


module.exports = router;
