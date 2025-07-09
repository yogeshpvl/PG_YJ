
const express = require('express');
const { register, login,addGuestToPG } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/addGuestToPG', addGuestToPG);

module.exports = router;
