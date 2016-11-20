var express = require('express');
var router = express.Router();
var passport = require('passport');

var passportConf = require('../config/passport');
var User = require('../models/user');


router.get('/login', function(req, res){
  var messages = req.flash('loginMessage');
  if(req.user) return res.redirect('/');
  res.render('/accounts/login', {messages: messages, hashErrors: messages.length > 0})
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true

}));


router.get('/signup', function(req, res){
  var messages = req.flash('errors');
  res.render('accounts/signup', {messages: messages, hashErrors: messages.length > 0 });
});

router.post('/signup', function(req, res){
  var user = new User();

  user.profile.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;

  User.findOne({email: req.body.email}, function(err, existingUser){
      if(existingUser){
        req.flash('errors', 'Account with that Email, is already in use')
        return res.redirect('/user/signup');
      }else{
        user.save(function(err, user){
          if(err){
            console.log(err)
          }else{
            res.redirect('/')
          }
        })
      }
  })


});

module.exports = router;
