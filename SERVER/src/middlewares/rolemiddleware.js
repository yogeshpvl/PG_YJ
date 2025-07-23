// middleware/restrictTo.js or roleMiddleware.js

const restrictTo = (allowedRoles = []) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }

    next();
  };
};

module.exports = restrictTo;
