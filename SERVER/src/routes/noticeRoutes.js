const express = require('express');
const router = express.Router();
const {
  createNoticeRequest,
  getNoticeRequests,
  approveOrRejectNotice
} = require('../controllers/noticeController');

const { protect } = require('../middlewares/authmiddleware');
const restrictTo = require('../middlewares/rolemiddleware');

// Guest creates notice
router.post('/', protect, createNoticeRequest);

// Owner views notices
router.get('/', protect, restrictTo(['owner']), getNoticeRequests);

// Owner approves/rejects
router.patch('/:id/approve', protect, restrictTo(['owner']), approveOrRejectNotice);

module.exports = router;
