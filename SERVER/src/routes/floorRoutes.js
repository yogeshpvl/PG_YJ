const express = require('express');
const router = express.Router();
const floorController = require('../controllers/floorController');

router.post('/', floorController.createFloor);
router.post('/bulk', floorController.bulkUploadFloors);

router.get('/pg/:pgId', floorController.getFloorsByPG);
router.put('/:id', floorController.updateFloor);     
router.delete('/:id', floorController.deleteFloor);

module.exports = router;
