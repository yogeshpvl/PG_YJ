const express = require('express');
const router = express.Router();
const {
  submitEnquiry,
  listEnquiries,
  approveEnquiry,
} = require('../controllers/enquiryController');
const { authenticateUser } = require('../middlewares/authmiddleware');

// Public route
router.post('/submit', submitEnquiry);

// Admin routes
router.get('/', authenticateUser, listEnquiries);
router.post('/approve', authenticateUser, approveEnquiry);

module.exports = router;
