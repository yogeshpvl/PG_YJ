const express = require('express');
const router = express.Router();
const controller = require('../controllers/guestPolicyController');

router.post('/guest-join', controller.createGuestPolicy);
router.get('/guest/:guestId', controller.getGuestPolicy);

module.exports = router;
