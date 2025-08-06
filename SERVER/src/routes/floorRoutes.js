const express = require('express');
const router = express.Router();
const floorController = require('../controllers/floorController');
const { protect } = require('../middlewares/authmiddleware');

router.post('/', protect,floorController.createFloor);
router.post('/bulk',protect, floorController.bulkUploadFloors);

router.get('/pg/:pgId', protect,floorController.getFloorsByPG);
router.put('/:id',protect, floorController.updateFloor);     
router.delete('/:id',protect, floorController.deleteFloor);

module.exports = router;
