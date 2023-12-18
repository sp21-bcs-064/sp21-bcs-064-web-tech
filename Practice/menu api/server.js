let express = require('express');
let app = express();
app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');

app.get('/books', function (req, res) {
  let products = [
    { title: 'Marker', price: 700 },
    { title: 'Pen', price: 300 },
    { title: 'rubber', price: 100 },
  ];
  res.render(products[0].title);
});

const mongoose = require('mongoose');
mongoose
  .connect('mongodb://localhost:27017/Menu', { useNewUrlParser: true })
  .then(() => console.log('Connected to Mongo....'))
  .catch((error) => console.log(error.message));
app.listen(5000, function () {
  console.log('Connected to server');
});
