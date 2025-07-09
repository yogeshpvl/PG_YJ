const express = require('express');
const router = express.Router();
const floorController = require('../controllers/floorController');

router.post('/', floorController.createFloor);
router.get('/pg/:pgId', floorController.getFloorsByPG);

module.exports = router;
