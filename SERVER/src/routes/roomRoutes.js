const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.post('/', roomController.createRoom);
router.get('/floor/:floorId', roomController.getRoomsByFloor);
router.get('/:id/guests', roomController.getRoomGuests);

module.exports = router;
