const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.post('/', roomController.createRoom);
router.post('/:id/generate-beds', roomController.generateBedsForRoom);

router.get('/floor/:floorId', roomController.getRoomsByFloor);
router.get('/:id/guests', roomController.getRoomGuests);
router.put('/:id', roomController.updateRoom);      
router.delete('/:id', roomController.deleteRoom);   
router.post('/bulk', roomController.bulkUploadRooms); 

module.exports = router;
