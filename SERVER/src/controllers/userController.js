const prisma = require('../config/db');

exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        pgId: true,
        pg: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true
          }
        },
        bed: {
          select: {
            id: true,
            label: true,
            rent: true,
            room: {
              select: {
                number: true,
                sharing: true,
                isAC: true,
                floor: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, password } = req.body;

    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    if (phone) dataToUpdate.phone = phone;
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        pgId: true
      }
    });

    res.status(200).json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
