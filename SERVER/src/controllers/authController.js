
const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const { generateToken } = require('../config/jwt');

exports.register = async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  // Check required fields
  if (!email || !password || !role || !name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: { email }
    });

    if (userExists) {
      return res.status(400).json({ message: 'Email already used' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role, phone },
    });

    const token = generateToken(user);

    res.status(201).json({
      user: { id: user.id, email: user.email, role: user.role },
      token
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

  const token = generateToken(user);
  res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
};

exports.addGuestToPG = async (req, res) => {
  const { name, email, phone, password, pgId, ownerId } = req.body;

  const pg = await prisma.pG.findFirst({ where: { id: pgId, ownerId } });
  if (!pg) return res.status(403).json({ message: 'Unauthorized PG access' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const guest = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'guest',
      pgId
    }
  });

  res.status(201).json({ message: 'Guest created', guestId: guest.id });
};
