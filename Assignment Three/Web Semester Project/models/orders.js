const mongoose = require('mongoose');
const joi = require('@hapi/joi');

const orderSchema = mongoose.Schema({
  user: String,
  items: { type: [String], default: [] },
  total: Number,
});

const Order = mongoose.model('Order', orderSchema);

module.exports.Order = Order;
