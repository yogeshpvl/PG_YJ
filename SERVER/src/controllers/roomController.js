const prisma = require('../config/db');

// Create Room
exports.createRoom = async (req, res) => {
  try {
    const { number, floorId, sharing, isAC } = req.body;
    const room = await prisma.room.create({
      data: { number, floorId, sharing, isAC }
    });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all rooms by floor
exports.getRoomsByFloor = async (req, res) => {
  try {
    const floorId = parseInt(req.params.floorId);
    const rooms = await prisma.room.findMany({
      where: { floorId },
      include: { beds: true }
    });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getRoomGuests = async (req, res) => {
  try {
    const roomId = parseInt(req.params.id);

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        beds: {
          include: {
            guest: true
          }
        }
      }
    });

    if (!room) return res.status(404).json({ message: 'Room not found' });

    // Extract only occupied beds with guest info
    const guests = room.beds
      .filter(bed => bed.guest !== null)
      .map(bed => ({
        bedId: bed.id,
        bedLabel: bed.label,
        guest: {
          id: bed.guest.id,
          name: bed.guest.name,
          email: bed.guest.email,
          phone: bed.guest.phone
        }
      }));

    res.status(200).json({ roomId, guests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
