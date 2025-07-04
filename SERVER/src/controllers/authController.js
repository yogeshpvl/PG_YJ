
const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const { generateToken } = require('../config/jwt');

exports.register = async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) return res.status(400).json({ message: 'Email already used' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role, phone },
  });

  const token = generateToken(user);

  res.status(201).json({ user: { id: user.id, email: user.email, role: user.role }, token });
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
