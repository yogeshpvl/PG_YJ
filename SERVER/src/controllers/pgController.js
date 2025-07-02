const prisma = require('../config/prisma');

exports.createPG = async (req, res) => {
  const { name, address, ownerId } = req.body;

  try {
    const pg = await prisma.pG.create({
      data: { name, address, ownerId },
    });
    res.status(201).json(pg);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create PG', detail: err });
  }
};

exports.getPGs = async (req, res) => {
  const pgs = await prisma.pG.findMany({
    include: { rooms: true, expenses: true },
  });
  res.json(pgs);
};
