const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/user/signup", authController.signup);
router.post("/user/login", authController.login);

module.exports = router;
