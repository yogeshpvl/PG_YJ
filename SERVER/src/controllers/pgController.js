const prisma = require('../config/db');

// Create PG
exports.createPG = async (req, res) => {
  try {
    const { name, address, city, rentDueDay, pincode } = req.body;
    const ownerId = req.user.id;

    // 1. Create the PG
    const pg = await prisma.pG.create({
      data: { name, address, city, rentDueDay, ownerId, pincode }
    });

    // 2. Update the User table with the new pgId
    await prisma.user.update({
      where: { id: ownerId },
      data: { pgId: pg.id }
    });

    res.status(201).json(pg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all PGs of owner
exports.getOwnerPGs = async (req, res) => {
  try {
    const ownerId = req.user.id;
    console.log("ownerId",ownerId)

    const pgs = await prisma.pG.findMany({
      where: { ownerId }
    });

    res.json(pgs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get PG by ID with details
exports.getPGDetails = async (req, res) => {
  try {
    const pgId = parseInt(req.params.id);
    const ownerId = req.user.id;

    const pg = await prisma.pG.findFirst({
      where: { id: pgId, ownerId },
      include: {
        floors: { include: { rooms: { include: { beds: true } } } },
        beds: true,
        guests: true,
        expenses: true,
        payments: true,
        issues: true,
        menus: true,
        notifications: true
      }
    });

    if (!pg) return res.status(404).json({ message: 'PG not found' });

    res.json(pg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update PG
exports.updatePG = async (req, res) => {
  try {
    const pgId = parseInt(req.params.id);
    const ownerId = req.user.id;
    const data = req.body;

    const pg = await prisma.pG.updateMany({
      where: { id: pgId, ownerId },
      data
    });

    if (!pg.count) return res.status(404).json({ message: 'PG not found or unauthorized' });

    res.json({ message: 'PG updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deactivate PG
exports.deactivatePG = async (req, res) => {
  try {
    const pgId = parseInt(req.params.id);
    const ownerId = req.user.id;

    const pg = await prisma.pG.updateMany({
      where: { id: pgId, ownerId },
      data: { isActive: false }
    });

    if (!pg.count) return res.status(404).json({ message: 'PG not found or unauthorized' });

    res.json({ message: 'PG deactivated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PG Analytics Summary
exports.getPGSummary = async (req, res) => {
  try {
    const pgId = parseInt(req.params.id);
    const ownerId = req.user.id;

    const [
      bedStats,
      occupiedBedsCount,
      paidPayments,
      totalExpenses,
      pendingIssues,
      noticePeriodGuests,
      rentPaidCount,
      rentDueCount,
      maintenanceRequests
    ] = await Promise.all([

      // 1. Total beds and rent
      prisma.bed.aggregate({
        where: { pgId },
        _count: { id: true },
        _sum: { rent: true }
      }),

      // 2. Occupied beds
      prisma.bed.count({
        where: { pgId, isOccupied: true }
      }),

      // 3. Total paid amount
      prisma.payment.aggregate({
        where: { pgId, status: 'paid' },
        _sum: { amount: true }
      }),

      // 4. Total expenses
      prisma.expense.aggregate({
        where: { pgId },
        _sum: { amount: true }
      }),

      // 5. Pending issues (all types)
      prisma.issue.findMany({
        where: { pgId, status: 'pending' }
      }),

      // 6. Guests in notice period
      prisma.noticeRequest.count({
        where: {
          pgId,
          status: 'Pending', // You could add noticeDate > today if needed
        }
      }),

      // 7. Count of paid rent records
      prisma.payment.count({
        where: { pgId, status: 'paid' }
      }),

      // 8. Count of due rent records
      prisma.payment.count({
        where: { pgId, status: 'due' }
      }),

      // 9. Count of maintenance requests (issues with keyword)
      prisma.issue.count({
        where: {
          pgId,
          status: 'pending',
          message: {
            contains: 'maintain', // you can tune this logic
            mode: 'insensitive'
          }
        }
      })
    ]);

    const totalBeds = bedStats._count.id;
    const occupiedBeds = occupiedBedsCount;
    const availableBeds = totalBeds - occupiedBeds;

    res.json({
      totalBeds,
      occupiedBeds,
      availableBeds,
      totalRent: bedStats._sum.rent || 0,
      revenue: paidPayments._sum.amount || 0,
      expenses: totalExpenses._sum.amount || 0,
      pendingIssues: pendingIssues.length,
      noticePeriodGuests,
      rentPaid: rentPaidCount,
      rentDue: rentDueCount,
      maintenanceRequests
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Owner Dashboard (Monthly Revenue, Occupancy, etc.)
exports.getPGDashboard = async (req, res) => {
  try {
    const pgId = parseInt(req.params.id);

    const [occupiedBeds, totalBeds, payments] = await Promise.all([
      prisma.bed.count({ where: { pgId, isOccupied: true } }),
      prisma.bed.count({ where: { pgId } }),
      prisma.payment.groupBy({
        by: ['month'],
        where: { pgId, status: 'paid' },
        _sum: { amount: true },
        orderBy: { month: 'asc' }
      })
    ]);

    res.json({
      occupancyRate: totalBeds ? ((occupiedBeds / totalBeds) * 100).toFixed(2) : 0,
      monthlyRevenue: payments.map(p => ({ month: p.month, revenue: p._sum.amount }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
