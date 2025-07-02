const prisma = require('../config/prisma');

exports.register = async (req, res) => {
  const { name, phone, role } = req.body;

  try {
    const user = await prisma.user.create({
      data: { name, phone, role },
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', detail: err });
  }
};
