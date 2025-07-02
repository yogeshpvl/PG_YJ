const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Add a payment
router.post('/add', paymentController.addPayment);

// Get all payments
router.get('/all', paymentController.getPayments);

module.exports = router;
