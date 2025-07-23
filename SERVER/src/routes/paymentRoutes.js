const express = require('express');
const router = express.Router();
const paymentCtrl = require('../controllers/paymentController');

// Add Payment
router.post('/create', paymentCtrl.createPayment);

// Get All Payments (PG ID)
router.get('/pg/:pgId', paymentCtrl.getPayments);

// Update Payment Status
router.patch('/:paymentId/status', paymentCtrl.updatePaymentStatus);

// Filter Payments
router.get('/pg/:pgId/filter', paymentCtrl.filterPayments);

// Get Rent Dues for Month
router.get('/dues', paymentCtrl.getRentDues);

module.exports = router;
