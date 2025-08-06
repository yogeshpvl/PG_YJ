const express = require('express');
const router = express.Router();
const complaintCtrl = require('../controllers/complaintController');
const { protect } = require('../middlewares/authmiddleware');
// Create a complaint
router.post('/create', protect,complaintCtrl.createComplaint);

// Get complaints by user ID
router.get('/user',protect, complaintCtrl.getUserComplaints);

// Admin: Get complaints by PG ID
router.get('/pg/:pgId', complaintCtrl.getPGComplaints);

// Update complaint status
router.patch('/:id/status', complaintCtrl.updateComplaintStatus);

// Delete complaint
router.delete('/:id', complaintCtrl.deleteComplaint);

module.exports = router;
