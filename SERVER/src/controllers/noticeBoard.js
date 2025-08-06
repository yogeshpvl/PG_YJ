const prisma = require('../config/db');
const { uploadToS3, deleteFromS3 } = require('../utils/s3');

exports.createNotice = async (req, res) => {
  try {
    const { title, description, pgId } = req.body;
    const userId = req.user.id; // assume token-based

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToS3(req.file);
    }

    const notice = await prisma.noticeBoard.create({
      data: { title, description, imageUrl, userId, pgId }
    });

    res.status(201).json({ message: 'Notice created', notice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNoticesByPG = async (req, res) => {
  try {
    const { pgId } = req.params;
    const notices = await prisma.noticeBoard.findMany({
      where: { pgId: parseInt(pgId) },
      orderBy: { createdAt: 'desc' }
    });

    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await prisma.noticeBoard.findUnique({ where: { id: parseInt(id) } });

    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    if (notice.imageUrl) {
      await deleteFromS3(notice.imageUrl);
    }

    await prisma.noticeBoard.delete({ where: { id: parseInt(id) } });

    res.json({ message: 'Notice deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
