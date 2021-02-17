const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/users');
const passport = require('passport');
const authenticate = require('../authenticate');

const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.route('/')
.get(authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json('Welcome to your MBR profile page');
});

userRouter.route('/register')
.get((req, res, next) => {
  if (req.body.name !== '' || req.body.password !== '') {
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json('Welcome to MBR register page');
  } else {
    res.redirect('/');
  }
})
.post((req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.name)
        user.name = req.body.name;
        user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
});

userRouter.post('/login', (req, res, next) => {

  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: 'Login Unsuccessful!', err: info});
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});          
      }

      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Login Successful!', token: token});
    }); 
  }) (req, res, next);
});

module.exports = userRouter;
