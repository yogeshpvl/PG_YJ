const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // no disk storage; handled in memory
const protect = require('../middlewares/auth');
const noticeCtrl = require('../controllers/noticeBoardController');

router.post('/create', protect, upload.single('image'), noticeCtrl.createNotice);
router.get('/:pgId', protect, noticeCtrl.getNoticesByPG);
router.delete('/:id', protect, noticeCtrl.deleteNotice);

module.exports = router;
