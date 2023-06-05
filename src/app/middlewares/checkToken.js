require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
  const authHeader = request.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if ((request.method === 'OPTIONS')) {
    return next();
  }

  if (!token) {
    return response.status(401).json({ error: 'Token denied' });
  }

  const secret = process.env.CLIENT_SECRET;

  try {
    const decoded = jwt.verify(token, secret);

    request.id = decoded.id;

    if (request.path !== '*') {
      return next();
    }

    return response.status(403).json({ error: 'Access denied' });
  } catch (error) {
    return response.status(400).json({ error: 'Invalid token' });
  }
}
