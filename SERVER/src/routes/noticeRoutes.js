const express = require('express');
const router = express.Router();
const controller = require('../controllers/noticeController');

router.post('/notice-request', controller.createNotice);
router.put('/notice-request/approve/:id', controller.approveNotice);
router.get('/notice/pg/:pgId', controller.getNoticesByPG);

module.exports = router;
