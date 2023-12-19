const mongoose = require('mongoose');
const joi = require('@hapi/joi');

const reviewSchema = mongoose.Schema({
  user: String,
  review: String,
});

const Review = mongoose.model('Reviews', reviewSchema);

module.exports.Review = Review;
