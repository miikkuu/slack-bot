const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');

router.post('/events', approvalController.handleEvent);
router.post('/interactions', approvalController.handleInteraction);

module.exports = router;
