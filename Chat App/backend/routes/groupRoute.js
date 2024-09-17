const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const authenticate = require("../middlewares/authenticator");

router.post("/user/createGroup", authenticate, groupController.createGroup);
router.get("/getGroups", authenticate, groupController.getGroups);
router.get("/groups/:groupId", authenticate, groupController.getGroupById);
router.post("/user/addMember", authenticate, groupController.addMember);

module.exports = router;
