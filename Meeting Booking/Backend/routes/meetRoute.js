const express = require('express');
const router = express.Router();
const meetController = require('../controllers/MeetController');

router.get('/meets', meetController.getMeets);
router.delete('/:id/:slotId', meetController.cancelMeet);

module.exports = router;