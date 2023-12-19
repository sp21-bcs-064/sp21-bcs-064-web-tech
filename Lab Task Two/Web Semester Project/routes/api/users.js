const express = require('express');
let router = express.Router();
var bcrypt = require('bcryptjs');
const _ = require('lodash');
let { User, validateUser, validateUserLogin } = require('../../models/users');
let jwt = require('jsonwebtoken');

router.post('/register', async function (req, res) {
  let user2 = await User.findOne({ email: req.body.email });
  if (user2)
    return res.status(400).send('User with given email already exists');
  let user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.role = req.body.role;
  let salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  return res.send(_.pick(user, ['name', 'email']));
});

router.get('/', async (req, res) => {
  let items = await User.find();
  return res.send(items);
});

router.post('/login', async (req, res) => {
  let user2 = await User.findOne({ email: req.body.email });
  if (!user2) return res.status(400).send('User not registered');
  let isValid = bcrypt.compare(req.body.password, user2.password);
  if (isValid) {
    req.session.user = user;
    req.session.flash = { type: 'success', message: 'Logged in Successfully' };
    return res.redirect('/');
  } else {
    req.session.flash = { type: 'danger', message: 'Try Again' };

    return res.redirect('/login');
  }
});

router.get('/logout', (req, res) => {
  //   return res.send(req.query);
  req.session.user = null;
  req.session.flash = { type: 'info', message: 'Logged Out' };
  res.redirect('/login');
});

router.get('/login', (req, res) => {
  //   return res.send(req.query);
  // req.session.flash = { type: "success", message: "whoala" };
  res.render('auth/login');
});

module.exports = router;
