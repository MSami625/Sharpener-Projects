const express = require("express");
const router = express.Router();
const signupController = require("../controllers/signupController");

router.post("/user/signup", signupController.signup);
router.post("/user/login", signupController.login);

module.exports = router;
