const prisma = require('../config/db');

// Create a complaint
exports.createComplaint = async (req, res) => {
  try {
    const { title, description,  pgId } = req.body;
     const userId = req.user.id;
    const complaint = await prisma.complaint.create({
      data: { title, description, userId, pgId }
    });
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get complaints for a specific user
exports.getUserComplaints = async (req, res) => {
  try {
      const userId = req.user.id;
  
    const complaints = await prisma.complaint.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' }
    });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Get complaints by PG ID
exports.getPGComplaints = async (req, res) => {
  try {
    const { pgId } = req.params;
    const complaints = await prisma.complaint.findMany({
      where: { pgId: parseInt(pgId) },
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update complaint status
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.complaint.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a complaint
exports.deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.complaint.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Complaint deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
