
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

exports.registerGuest = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    // Check for existing email or phone
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ]
      }
    });

    if (existingUser) {
      const conflictField = existingUser.email === email ? 'Email' : 'Phone number';
      return res.status(400).json({ message: `${conflictField} already in use` });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create guest user
    const guest = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'guest'
      }
    });

    res.status(201).json({ message: 'Guest registered', guestId: guest.id });
  } catch (error) {
    console.error('registerGuest error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




exports.addGuestToPG = async (req, res) => {
  try {
    const {  pgId, ownerId } = req.body;

      const userId = req.user.id;
      const role = req.user.role;
    if (role !== 'guest') {
      return res.status(403).json({ message: 'Only guests can join PGs' });
    }

    // Check if PG exists and belongs to this owner
    const pg = await prisma.pG.findFirst({
      where: { id: pgId, ownerId }
    });

    if (!pg) {
      return res.status(403).json({ message: 'Invalid PG or Unauthorized access' });
    }

    // Assign user to PG
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        pgId,
        role: 'guest'
      }
    });

    res.status(200).json({ message: 'Guest successfully added to PG', guest: updatedUser });

  } catch (error) {
    console.error('addGuestToPG error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getGuestsByPgId = async (req, res) => {
  try {
    const pgId = parseInt(req.params.pgid);

    if (isNaN(pgId)) {
      return res.status(400).json({ message: 'Invalid PG ID' });
    }

    const guests = await prisma.user.findMany({
      where: {
        pgId,
        role: 'guest'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        pgId: true,
        createdAt: true
      }
    });

    res.json({ guests });

  } catch (error) {
    console.error('getGuestsByPgId error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

