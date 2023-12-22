const express = require('express');
let router = express.Router();
var { food, validate } = require('../../models/Food');
let { Order } = require('../../models/orders');
let { Review } = require('../../models/review');

function clearAllCookies() {
  var cookies = document.cookie.split(';');

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf('=');
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

router.get('/addproduct', function (req, res) {
  res.render('addproduct');
});

router.get('/editfood', function (req, res) {
  res.render('editfood');
});

router.get('/deletefood', async function (req, res) {
  let page = req.params.page ? Number(req.params.page) : 1;
  let perPage = 9;
  let skip = perPage * (page - 1);
  let fooditems = await food.find().skip(skip).limit(perPage);
  let total = await food.countDocuments();
  let totalPages = Math.ceil(total / perPage);
  return res.render('deletefood', { fooditems, totalPages, page });
});

router.get('/products/:page?', async (req, res) => {
  let page = req.params.page ? Number(req.params.page) : 1;
  let perPage = 9;
  let skip = perPage * (page - 1);
  let fooditems = await food.find().skip(skip).limit(perPage);
  let total = await food.countDocuments();
  let totalPages = Math.ceil(total / perPage);
  return res.render('fooditems', { fooditems, totalPages, page });
});

router.get('/deletefromcart/:id', async function (req, res) {
  let cart = req.cookies.cart;
  const itemIdToRemove = req.params.id;
  const updatedCart = cart.filter((itemId) => itemId !== itemIdToRemove);
  res.cookie('cart', updatedCart);
  req.session.flash = {
    type: 'success',
    message: 'Product removed from cart.',
  };
  res.redirect('/cart');
});

router.post('/addproduct', async (req, res) => {
  let product = new food();
  let prodtemp = await food.findOne({ name: req.body.prodname });
  if (prodtemp) {
    req.session.flash = { type: 'danger', message: 'Food Already Exists' };
    return res.redirect('/addproduct');
  }
  product.name = req.body.prodname;
  product.price = req.body.prodprice;
  await product.save();
  req.session.flash = { type: 'success', message: 'Food is added' };
  return res.redirect('/products');
});

router.post('/', async (req, res) => {
  let review = new Review();
  review.user = req.session.user;
  review.review = req.body.review;
  await review.save();
  req.session.flash = {
    type: 'success',
    message: 'Your review has been saved successfully',
  };
  return res.redirect('/');
});

router.get('/cart', async function (req, res, next) {
  let cart = req.cookies.cart;
  if (!cart) cart = [];
  let products = await food.find({ _id: { $in: cart } });

  let total = products.reduce(
    (total, product) => total + Number(product.price),
    0
  );

  res.render('cart', { products, total });
});

router.get('/add-cart/:id', function (req, res, next) {
  let cart = req.cookies.cart;
  if (!cart) cart = [];
  console.log(req.body.qty);
  cart.push(req.params.id);
  res.cookie('cart', cart);
  req.session.flash = { type: 'success', message: 'Product Added To Cart' };
  res.redirect('/');
});

router.get('/checkout', async function (req, res, next) {
  let cart = req.cookies.cart;

  let products = await food.find({ _id: { $in: cart } });
  if (cart == '') {
    req.session.flash = { type: 'danger', message: 'Cart is Empty' };
    return res.redirect('cart');
  }
  let total = products.reduce(
    (total, product) => total + Number(product.price),
    0
  );

  let order = new Order();
  order.user = req.session.user.name;
  order.items = products;
  order.total = total;

  await order.save();
  req.session.flash = { type: 'success', message: 'Checkout Successful' };
  res.cookie('cart', []);
  return res.redirect('/products');
});

module.exports = router;
