const jwt = require('jsonwebtoken');
const User = require('../models/users');

async function auth(req, res, next) {
  let token = req.header('x-auth-token');
  if (!token) return res.status(400).send('Token does not exist');
  try {
    let user = jwt.verify(token, 'privateKey');
    req.user = await User.findById(user._id);
  } catch (err) {
    return res.status(401).send('Invalid token');
  }
  next();
}

module.exports = auth;
