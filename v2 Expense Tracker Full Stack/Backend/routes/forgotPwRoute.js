const express = require("express");
const router = express.Router();

const forgotPwController = require("../controllers/forgotPwController");

router.post("/password/forgotpassword", forgotPwController.sendEmail);

module.exports = router;
