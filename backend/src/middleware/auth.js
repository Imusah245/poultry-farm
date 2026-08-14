const jwt = require('jsonwebtoken');

/**
 * Middleware to protect routes by verifying JWT tokens.
 * Extracts token from Authorization header (Bearer scheme),
 * verifies it, and attaches decoded payload to req.user.
 */
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

module.exports = { protect };
