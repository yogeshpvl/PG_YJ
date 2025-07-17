const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authmiddleware');

router.get('/me', protect, userController.getMyProfile);
router.put('/me', protect, userController.updateMyProfile);

module.exports = router;
