const express = require("express");
const router = express.Router();

const UserMsgController = require("../controllers/UserMsgController");
const authenticator = require("../middlewares/authenticator");

router.post("/user/message", authenticator, UserMsgController.postUserMsg);
router.get("/users/messages", authenticator, UserMsgController.getAllMessages);
router.get("/users/search", authenticator, UserMsgController.searchUsers);
router.post("/upload", authenticator, UserMsgController.uploadFile);

module.exports = router;
