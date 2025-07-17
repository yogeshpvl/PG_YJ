const prisma = require('../config/db');

// Create Notice Request
exports.createNotice = async (req, res) => {
  try {
    const { guestId, pgId, reason } = req.body;

    const notice = await prisma.noticeRequest.create({
      data: { guestId, pgId, reason }
    });

    res.status(201).json({ message: 'Notice submitted', notice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve Notice
exports.approveNotice = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const updated = await prisma.noticeRequest.update({
      where: { id },
      data: { status: 'Approved' }
    });

    res.json({ message: 'Notice approved', updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Notices by PG
exports.getNoticesByPG = async (req, res) => {
  try {
    const pgId = parseInt(req.params.pgId);

    const notices = await prisma.noticeRequest.findMany({
      where: { pgId },
      include: { guest: true }
    });

    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
