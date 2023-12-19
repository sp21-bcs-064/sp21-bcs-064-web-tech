const mongoose = require('mongoose');
const joi = require('@hapi/joi');

const foodSchema = mongoose.Schema({
  name: String,
  price: Number,
});

const Food = mongoose.model('Food', foodSchema);

function validateFood(data) {
  const schema = joi.object({
    name: joi.string().min(5).max(20).required(),
    price: joi.number().min(0).required(),
  });
  return schema.validate(data, { abortEarly: false });
}

module.exports.food = Food;
