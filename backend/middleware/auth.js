const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expects: "Bearer <token>"
  if (!token) return res.status(401).json({ message: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Now req.user.id and req.user.role are available in any protected route
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};