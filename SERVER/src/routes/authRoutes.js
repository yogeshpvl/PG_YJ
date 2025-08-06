
const express = require('express');
const { register, login,addGuestToPG ,registerGuest,getGuestsByPgId} = require('../controllers/authController');
const router = express.Router();
const { protect } = require('../middlewares/authmiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/registerGuest',protect, registerGuest);
router.post('/addGuestToPG',protect, addGuestToPG);

router.get('/guests/:pgid', protect, getGuestsByPgId);

module.exports = router;
