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

exports.getPGSummary = async (req, res) => {
  try {
    const pgId = parseInt(req.params.id);
    const { month } = req.query; // expects format: "2025-08"

    let startDate, endDate;

    if (month) {
      const [year, monthStr] = month.split("-");
      const m = parseInt(monthStr);
      const y = parseInt(year);

      startDate = new Date(y, m - 1, 1); // first day of month
      endDate = new Date(y, m, 0, 23, 59, 59, 999); // last day of month
    }

    const paymentDateFilter = month
      ? { date: { gte: startDate, lte: endDate } }
      : {};

    const expenseDateFilter = month
      ? { date: { gte: startDate, lte: endDate } }
      : {};

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
      prisma.bed.aggregate({
        where: { pgId },
        _count: { id: true },
        _sum: { rent: true }
      }),

      prisma.bed.count({
        where: { pgId, isOccupied: true }
      }),

      prisma.payment.aggregate({
        where: { pgId, status: 'paid', ...paymentDateFilter },
        _sum: { amount: true }
      }),

      prisma.expense.aggregate({
        where: { pgId, ...expenseDateFilter },
        _sum: { amount: true }
      }),

      prisma.issue.findMany({
        where: { pgId, status: 'pending' }
      }),

      prisma.noticeRequest.count({
        where: {
          pgId,
          status: 'Pending'
        }
      }),

      prisma.payment.count({
        where: { pgId, status: 'paid', ...paymentDateFilter }
      }),

      prisma.payment.count({
        where: { pgId, status: 'unpaid', ...paymentDateFilter }
      }),

      prisma.complaint.count({
        where: {
          pgId,
          status: 'pending',
         
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
