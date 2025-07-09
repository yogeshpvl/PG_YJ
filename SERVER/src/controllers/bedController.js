const prisma = require('../config/db');

// Create Bed
exports.createBed = async (req, res) => {
  try {
    const { label, roomId, pgId, rent, facilities } = req.body;

    const bed = await prisma.bed.create({
      data: {
        label,
        roomId,
        pgId,
        rent: parseFloat(rent),
        facilities,
      }
    });

    res.status(201).json(bed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all beds by PG
exports.getBedsByPG = async (req, res) => {
  try {
    const pgId = parseInt(req.params.pgId);
    const beds = await prisma.bed.findMany({
      where: { pgId },
      include: {
        room: true,
        guest: { select: { id: true, name: true, email: true } }
      }
    });
    res.json(beds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignGuestToBed = async (req, res) => {
  try {
    const { bedId, guestId } = req.body;

    // Check if bed exists and is available
    const bed = await prisma.bed.findUnique({
      where: { id: bedId }
    });

    if (!bed) return res.status(404).json({ message: 'Bed not found' });
    if (bed.isOccupied) return res.status(400).json({ message: 'Bed already occupied' });

    // Assign guest to bed
    const updatedBed = await prisma.bed.update({
      where: { id: bedId },
      data: {
        guestId,
        isOccupied: true
      }
    });

    res.status(200).json({ message: 'Guest assigned to bed', bed: updatedBed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
