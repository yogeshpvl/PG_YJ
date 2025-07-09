const prisma = require('../config/db');

// Create Menu
exports.createMenu = async (req, res) => {
  try {
    const { date, imageUrl, items, pgId } = req.body;
    const menu = await prisma.menu.create({
      data: { date: new Date(date), imageUrl, items, pgId },
    });
    res.status(201).json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Menus for a PG
exports.getMenus = async (req, res) => {
  try {
    const pgId = parseInt(req.params.pgId);
    const menus = await prisma.menu.findMany({ where: { pgId } });
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};