const express = require("express");
const router = express.Router();

const UserMsgController = require("../controllers/UserMsgController");
const authenticator = require("../middlewares/authenticator");

router.post("/user/message", authenticator, UserMsgController.postUserMsg);
router.get("/users/messages", authenticator, UserMsgController.getAllMessages);

module.exports = router;
