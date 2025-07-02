const prisma = require('../config/prisma');

exports.addRoom = async (req, res) => {
  const { pgId, roomNo, floor, capacity } = req.body;

  try {
    const room = await prisma.room.create({
      data: { pgId, roomNo, floor, capacity },
    });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add room', detail: err });
  }
};
