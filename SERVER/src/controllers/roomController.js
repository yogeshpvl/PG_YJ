const prisma = require('../config/db');

// Create Room
exports.createRoom = async (req, res) => {
  try {
    const { number, floorId, sharing, amenities  } = req.body;
    const room = await prisma.room.create({
      data: { number, floorId, sharing, amenities  }
    });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generate Beds for a Room based on Sharing
exports.generateBedsForRoom = async (req, res) => {
  try {
    const roomId = parseInt(req.params.id);

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        floor: {
          select: { pgId: true }
        },
        beds: true
      }
    });

    if (!room) return res.status(404).json({ message: 'Room not found' });

    const existingBeds = room.beds.length;
    const bedsToCreate = room.sharing - existingBeds;

    if (bedsToCreate <= 0) {
      return res.status(400).json({ message: 'Beds already created or exceed sharing capacity' });
    }

    const bedsData = Array.from({ length: bedsToCreate }).map((_, i) => ({
      label: `Bed ${existingBeds + i + 1}`,
      roomId: room.id,
      pgId: room.floor.pgId,
      rent: 6000,
      isOccupied: false
    }));

    await prisma.bed.createMany({ data: bedsData });

    res.status(201).json({ message: `Created ${bedsToCreate} beds for room ${room.number}` });
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


// Update Room
exports.updateRoom = async (req, res) => {
  try {
    const roomId = parseInt(req.params.id);
    const { number, floorId, sharing, isAC } = req.body;

    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: { number, floorId, sharing, isAC }
    });

    res.json(updatedRoom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete Room
exports.deleteRoom = async (req, res) => {
  try {
    const roomId = parseInt(req.params.id);

    await prisma.room.delete({
      where: { id: roomId },
    });

    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Bulk Upload Rooms
exports.bulkUploadRooms = async (req, res) => {
  try {
    const { floorId, rooms } = req.body;

    if (!Array.isArray(rooms) || rooms.length === 0) {
      return res.status(400).json({ error: 'Rooms must be a non-empty array' });
    }

    const newRooms = await prisma.room.createMany({
      data: rooms.map(room => ({
        number: room.number,
        floorId,
        sharing: room.sharing,
        isAC: room.isAC || false
      })),
      skipDuplicates: true // optional
    });

    res.status(201).json({ message: 'Rooms added successfully', count: newRooms.count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
