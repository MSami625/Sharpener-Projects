const express = require("express");
const router = express.Router();

const UserMsgController = require("../controllers/UserMsgController");
const authenticator = require("../middlewares/authenticator");

router.post("/user/message", authenticator, UserMsgController.postUserMsg);

module.exports = router;
