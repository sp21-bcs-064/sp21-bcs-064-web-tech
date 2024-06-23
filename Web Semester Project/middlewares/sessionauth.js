let { User } = require('../models/users');
module.exports = async function (req, res, next) {
  //login a user indevelopment mode so that we dont need to relogin during server rebooting
  let user = await User.findOne({ email: 'ahmed@gmail.com' });
  // // console.log("user");
  // // console.log(user);
  req.session.user = user;
  console.log(user);
  // // end default login
  // // comment above code in deployment
  if (!req.session.user) return res.render('auth/login');
  else {
    req.user = req.session.user;
    next();
  }
};
