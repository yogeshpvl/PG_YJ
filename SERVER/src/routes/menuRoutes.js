const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.post('/', menuController.createMenu);
router.get('/:pgId', menuController.getMenus);

module.exports = router;