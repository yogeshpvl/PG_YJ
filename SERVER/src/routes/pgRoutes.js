const express = require('express');
const router = express.Router();
const pgController = require('../controllers/pgController');
const { protect } = require('../middlewares/authmiddleware'); 



// Create PG
router.post('/create', protect, pgController.createPG);

// Get all PGs of logged-in owner
router.get('/my', protect, pgController.getOwnerPGs);

// Get details of specific PG
router.get('/:id', protect, pgController.getPGDetails);

// Update PG
router.put('/:id', protect, pgController.updatePG);

// Deactivate PG
router.put('/:id/deactivate', protect, pgController.deactivatePG);

// Summary analytics
router.get('/:id/summary', protect, pgController.getPGSummary);

// Dashboard
router.get('/:id/dashboard', protect, pgController.getPGDashboard);

module.exports = router;
