const mongoose = require('mongoose');
const joi = require('@hapi/joi');

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});

const User = mongoose.model('User', userSchema);

function validateUser(data) {
  const schema = joi.object({
    name: joi.string().min(5).max(20).required(),
    email: joi.string().email().min(3).required(),
    password: joi.string().min(3).required(),
    role: joi.string().min(2).required(),
  });
  return schema.validate(data, { abortEarly: false });
}

function validateUserLogin(data) {
  const schema = joi.object({
    email: joi.string().email().min(3).required(),
    password: joi.string().min(3).required(),
  });
  return schema.validate(data, { abortEarly: false });
}

module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.validateUserLogin = validateUserLogin;
