const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../utils/config');

const generate = (data) => {
  return jwt.sign(data, JWT_SECRET, { expiresIn: '12h' });
};

module.exports = generate;
