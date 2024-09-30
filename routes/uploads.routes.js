const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { UPLOADS: { VALIDATOR, APIS } } = require("../controllers");
const {  upload} = require("../service/file/file.upload");

/* Post Apis */
router.post("/", auth({ usersAllowed: ["*"] }), upload.single("file"),  APIS.uploadFiles);

module.exports = router;
