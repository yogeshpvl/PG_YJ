const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); 
const {protect} = require('../middlewares/authmiddleware');
const noticeCtrl = require('../controllers/noticeBoard');


router.post('/create',  upload.single('image'), noticeCtrl.createNotice);
router.put('/edit/:id', protect, upload.single('image'), noticeCtrl.editNotice);

router.get('/:pgId', protect, noticeCtrl.getNoticesByPG);
router.delete('/:id', protect, noticeCtrl.deleteNotice);

module.exports = router;
