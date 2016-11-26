var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/products/:id', function(req, res, next){
  Product
  .find({category: req.params.id})
  .populate('category')
  .exec(function(err, products){
    if(err) return next(err);
    res.render('category', {products: products});
  });
});

module.exports = router;
