const prisma = require('../config/db');
const { deleteFromS3 } = require('../utils/s3');
const dayjs = require('dayjs');

const deleteOldNotices = async () => {
  const tenDaysAgo = dayjs().subtract(10, 'day').toDate();

  const oldNotices = await prisma.noticeBoard.findMany({
    where: {
      createdAt: { lte: tenDaysAgo }
    }
  });

  for (const notice of oldNotices) {
    if (notice.imageUrl) {
      await deleteFromS3(notice.imageUrl);
    }
    await prisma.noticeBoard.delete({ where: { id: notice.id } });
  }

  console.log(`${oldNotices.length} old notices deleted`);
};

module.exports = deleteOldNotices;
