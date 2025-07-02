const express = require('express');
const router = express.Router();
const pgController = require('../controllers/pgController');

// Create a new PG
router.post('/create', pgController.createPG);

// Get all PGs
router.get('/all', pgController.getPGs);

module.exports = router;
