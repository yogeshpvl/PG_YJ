const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Add a room to a PG
router.post('/add', roomController.addRoom);

// Get all rooms (optional)
router.get('/all', roomController.getAllRooms); // if implemented

module.exports = router;
