const prisma = require('../config/db');

const { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays } = require('date-fns');




// 1. Submit Enquiry (by prospective PG owner)
exports.submitEnquiry = async (req, res) => {
  const { name, phone, email, pgName, city } = req.body;

  const enquiry = await prisma.enquiry.create({
    data: { name, phone, email, pgName, city },
  });

  res.status(201).json({ message: 'Enquiry submitted', enquiry });
};

// 2. List All Enquiries (admin only)
exports.listEnquiries = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    status,
    dateFilter,
  } = req.query;

  const filters = {};

  // Search logic (name, email, phone, city)
  if (search) {
    filters.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Status filter
  if (status) {
    filters.status = status;
  }

  // Date filter logic
  if (dateFilter) {
    let dateRange = {};
    const today = new Date();

    switch (dateFilter) {
      case 'today':
        dateRange = { gte: startOfDay(today), lte: endOfDay(today) };
        break;
      case 'tomorrow':
        const tomorrow = addDays(today, 1);
        dateRange = { gte: startOfDay(tomorrow), lte: endOfDay(tomorrow) };
        break;
      case 'this_week':
        dateRange = { gte: startOfWeek(today), lte: endOfWeek(today) };
        break;
      case 'this_month':
        dateRange = { gte: startOfMonth(today), lte: endOfMonth(today) };
        break;
    }

    filters.createdAt = dateRange;
  }

  const total = await prisma.enquiry.count({ where: filters });
  const enquiries = await prisma.enquiry.findMany({
    where: filters,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: parseInt(limit),
  });

  res.json({
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
    data: enquiries,
  });
};

// 3. Approve Enquiry → Create PG Owner + PG
exports.approveEnquiry = async (req, res) => {
  const { enquiryId, password, rentDueDay } = req.body;

  const enquiry = await prisma.enquiry.findUnique({ where: { id: enquiryId } });
  if (!enquiry || enquiry.status !== 'pending') {
    return res.status(404).json({ message: 'Enquiry not found or already processed' });
  }

  // Create PG Owner account
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(password, 10);
  const owner = await prisma.user.create({
    data: {
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      role: 'owner',
      password: hashedPassword,
    },
  });

  // Create PG
  const pg = await prisma.pG.create({
    data: {
      name: enquiry.pgName,
      address: 'To be updated',
      city: enquiry.city,
      rentDueDay,
      ownerId: owner.id,
    },
  });

  // Mark Enquiry as approved
  await prisma.enquiry.update({
    where: { id: enquiryId },
    data: { status: 'approved' },
  });

  res.json({
    message: 'PG & Owner created successfully',
    ownerEmail: enquiry.email,
    tempPassword: password,
    pgId: pg.id,
  });
};
