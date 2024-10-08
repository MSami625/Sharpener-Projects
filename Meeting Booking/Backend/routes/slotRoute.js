const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');

router.get('/slots', slotController.getSlots);
router.post('/bookmeet', slotController.bookMeet);

module.exports = router;
