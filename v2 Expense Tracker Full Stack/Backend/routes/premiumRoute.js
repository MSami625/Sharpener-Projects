const express = require("express");
const router = express.Router();

const purchasePremiumController = require('../controllers/premiumController');

router.get('/premium/leaderboard', purchasePremiumController.getLeaderboard);

module.exports = router;