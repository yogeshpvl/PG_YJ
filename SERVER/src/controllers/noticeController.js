const prisma = require('../config/db');

const createNoticeRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const pgId = req.user.pgId;
    const { reason, customNoticeDate } = req.body;

    let finalNoticeDate = customNoticeDate ? new Date(customNoticeDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const request = await prisma.noticeRequest.create({
      data: {
        userId,
        pgId,
        reason,
        noticeDate: finalNoticeDate,
      },
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNoticeRequests = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { status } = req.query;

    // Get all PGs owned by the user
    const ownedPGs = await prisma.pG.findMany({
      where: { ownerId },
      select: { id: true },
    });

    const pgIds = ownedPGs.map(pg => pg.id);

    const requests = await prisma.noticeRequest.findMany({
      where: {
        pgId: { in: pgIds },
        ...(status ? { status } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: { noticeDate: 'desc' },
    });

    res.json({ requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const approveOrRejectNotice = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { action } = req.body; // "approve" or "reject"

    const request = await prisma.noticeRequest.findUnique({ where: { id } });
    if (!request) return res.status(404).json({ message: 'Notice not found' });

    if (action === 'approve') {
      // Step 1: Free the bed
      await prisma.bed.updateMany({
        where: { guestId: request.userId },
        data: {
          guestId: null,
          isOccupied: false,
        },
      });

      // Step 2: Remove guest from PG
      await prisma.user.update({
        where: { id: request.userId },
        data: {
          pgId: null,
        },
      });

      // Step 3: Mark notice as approved
      await prisma.noticeRequest.update({
        where: { id },
        data: {
          status: 'approved',
        },
      });

      return res.json({ message: 'Notice approved, guest removed from PG and bed freed' });
    }

    console.log("action---",action)
    if (action === 'reject') {
      await prisma.noticeRequest.update({
        where: { id },
        data: {
          status: 'rejected',
        },
      });

      return res.json({ message: 'Notice request rejected' });
    }

    return res.status(400).json({ message: 'Invalid action' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createNoticeRequest,
  getNoticeRequests,
  approveOrRejectNotice,
};
