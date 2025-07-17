const prisma = require('../config/db');

// Create Guest Policy (advance & maintenance)
exports.createGuestPolicy = async (req, res) => {
  try {
    const { guestId, pgId, advance, maintenance } = req.body;

    const existing = await prisma.guestPolicy.findUnique({ where: { guestId } });
    if (existing) return res.status(400).json({ message: "Policy already exists for this guest" });

    const policy = await prisma.guestPolicy.create({
      data: { guestId, pgId, advance, maintenance }
    });

    res.status(201).json({ message: 'Guest policy set', policy });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Guest Policy by Guest ID
exports.getGuestPolicy = async (req, res) => {
  try {
    const guestId = parseInt(req.params.guestId);

    const policy = await prisma.guestPolicy.findUnique({
      where: { guestId },
      include: { pg: true }
    });

    if (!policy) return res.status(404).json({ message: 'Policy not found' });

    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
