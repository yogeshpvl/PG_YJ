const express = require('express');
const router = express.Router();
const paymentCtrl = require('../controllers/paymentController');

router.post('/create', paymentCtrl.createPayment);
router.get('/', paymentCtrl.getAllPayments); // or use query params for filtering
router.get('/:id', paymentCtrl.getPaymentById);
router.put('/:id', paymentCtrl.updatePayment);
router.delete('/:id', paymentCtrl.deletePayment);


module.exports = router;
