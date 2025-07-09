const prisma = require('../config/db');

// Create Floor
exports.createFloor = async (req, res) => {
  try {
    const { name, pgId } = req.body;
    const floor = await prisma.floor.create({
      data: { name, pgId }
    });
    res.status(201).json(floor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all floors by PG ID
exports.getFloorsByPG = async (req, res) => {
  try {
    const pgId = parseInt(req.params.pgId);
    const floors = await prisma.floor.findMany({
      where: { pgId },
      include: { rooms: true }
    });
    res.json(floors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
