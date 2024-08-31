const express = require("express");
const router = express.Router();

const purchasePremiumController = require('../controllers/premiumController');
const authenticate = require("../middlewares/authenticate");

router.get('/premium/leaderboard',authenticate, purchasePremiumController.getLeaderboard);

module.exports = router;