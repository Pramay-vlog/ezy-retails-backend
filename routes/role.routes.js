const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");
const { constants: { ENUM: { ROLE } } } = require("../helpers")

const { ROLE: { VALIDATOR, APIS } } = require("../controllers");

/* Post Apis */
router.post("/", auth({ usersAllowed: [ROLE.ADMIN], isTokenRequired: true }), VALIDATOR.createRole, APIS.createRole);
router.get("/admin-role", APIS.getRoleForAdmin);
router.get("/role-for-user", APIS.getRoleForUser);

module.exports = router;
