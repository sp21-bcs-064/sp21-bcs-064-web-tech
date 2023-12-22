const express = require('express');
let router = express.Router();
var { food, validate } = require('../../models/Food');
const auth = require('../../middlewares/auth');
const validateFood = require('../../middlewares/validateProduct');

router.get('/', auth, async (req, res) => {
  let items = await food.find();
  return res.send(items);
});

router.get('/:id', async (req, res) => {
  try {
    let items = await food.findById(req.params.id);
    return res.send(items);
  } catch (err) {
    return res.status(400).send('Invalid Id');
  }
});

router.post('/insert', validateFood, async (req, res) => {
  let product = new food();
  let prodtemp = await food.find({ name: req.body.name });
  if (prodtemp) {
    req.session.flash('Food already exists');
    return res.redirect('/addproduct');
  }
  product.name = req.body.name;
  product.price = req.body.price;
  await product.save();
  return res.send(product);
});

router.get('/update/:id', validateFood, async (req, res) => {
  let product = await food.findById(req.params.id);
  product.name = req.body.name;
  product.price = req.body.price;
  await product.save();
  return res.send(product);
});

router.get('/delete/:id', async (req, res) => {
  const product = await food.findOneAndDelete({ _id: req.params.id });
  req.session.flash = {
    type: 'success',
    message: 'Product Deleted Successfully',
  };
  return res.redirect('/deletefood');
});

module.exports = router;
