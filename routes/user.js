var express = require('express');
var router = express.Router();
var passport = require('passport');

var passportConf = require('../config/passport');
var User = require('../models/user');



router.get('/profile', isLoggedIn, function(req, res, next){
  User.findOne({_id: req.user._id}, function(err, user){
    if(err){
    return next(err)
  }else{
    res.render('accounts/profile', {user: user});

  }
  });

});

router.get('/login', function(req, res){
  var messages = req.flash('loginMessage');
  if(req.user) return res.redirect('/');
  res.render('accounts/login', {messages: messages, hashErrors: messages.length > 0})
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/login',
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
          if(err) return next(err);

          req.logIn(user, function(err){
            res.redirect('/user/profile')
          })


        })
      }
  })


});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/edit-profile', function(req, res, next){
  res.render('accounts/edit-profile', {messages: req.flash('Success')});
});

router.post('/edit-profile', function(req, res, next){
User.findOne({_id: req.user._id}, function(err, user){
  if(err) return next(err)

  if(req.body.name) user.profile.name = req.body.name;
  if(req.body.address) user.address = req.body.address;

  user.save(function(err){
    if(err) return next(err)
    req.flash('success', 'Successfully Edited your profile');
    return res.redirect('/user/edit-profile')
    });
  });
});

module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
