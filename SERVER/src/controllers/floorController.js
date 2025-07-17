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

// Bulk Upload Floors
exports.bulkUploadFloors = async (req, res) => {
  try {
    const { floors, pgId } = req.body;

    if (!Array.isArray(floors) || floors.length === 0) {
      return res.status(400).json({ error: 'Floors must be a non-empty array' });
    }

    const newFloors = await prisma.floor.createMany({
      data: floors.map(name => ({
        name,
        pgId
      })),
      skipDuplicates: true // Optional: skips if floor with same name+pgId already exists
    });

    res.status(201).json({ message: 'Floors added successfully', count: newFloors.count });
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


// Update Floor
exports.updateFloor = async (req, res) => {
  try {
    const floorId = parseInt(req.params.id);
    const { name } = req.body;

    const updatedFloor = await prisma.floor.update({
      where: { id: floorId },
      data: { name },
    });

    res.json(updatedFloor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete Floor
exports.deleteFloor = async (req, res) => {
  try {
    const floorId = parseInt(req.params.id);

    await prisma.floor.delete({
      where: { id: floorId },
    });

    res.json({ message: 'Floor deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
