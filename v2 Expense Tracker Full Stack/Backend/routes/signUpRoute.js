const express = require("express");
const router = express.Router();
const SignUpController = require("../controllers/signUpController");

router.post("/signup", SignUpController.signUp);

module.exports = router;
