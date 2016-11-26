var express = require('express');
var router = express.Router();

var Category = require('../models/category');

router.get('/add-category', function(req, res, next){
  var messages = req.flash('success');
  res.render('admin/add-category', {messages: messages, hashErrors: messages.length > 0});
});

router.post('/add-category', function(req, res, next){
  var category = new Category();

  category.name = req.body.name;

  category.save(function(err){
    if(err) return next(err);
    req.flash('success', 'Successfully added a new category');
    return res.redirect('/admin/add-category')
  });
});

module.exports = router;
