const express = require('express');
const router = express.Router();
const bedController = require('../controllers/bedController');
    
router.post('/', bedController.createBed);
router.get('/pg/:pgId', bedController.getBedsByPG);

router.post('/assign', bedController.assignGuestToBed);
router.put('/:id', bedController.updateBed);
router.delete('/:id', bedController.deleteBed);
router.post('/bulk', bedController.bulkUploadBeds);

module.exports = router;
