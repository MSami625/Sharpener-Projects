const express = require("express");

const router = express.Router();


const contactUsController = require("../controllers/contactus");
const successController = require("../controllers/success");


router.get("/contact-us",contactUsController.getContactus );

router.post("/contact-us", contactUsController.PostContactus);

router.get("/success", successController.success);

module.exports = router;
