const express = require('express');
const router = express.Router();
const bedController = require('../controllers/bedController');

router.post('/', bedController.createBed);
router.get('/pg/:pgId', bedController.getBedsByPG);

router.post('/assign', bedController.assignGuestToBed);

module.exports = router;
