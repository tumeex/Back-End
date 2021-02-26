const express = require('express');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
const User = require('../models/users');
const authenticate = require('../authenticate');
const bcrypt = require("bcryptjs");
const findR = require('../queries/findReview');
const Reviews = require('../models/reviews');

const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.route('/')
.get(authenticate.verifyUser, (req, res, next) => {
  var id = mongoose.Types.ObjectId(authenticate.getUser(req.header("auth-token")).id);
  Reviews.aggregate(findR.findUserReviews(id),
    function (err, resu) {
      if (resu != '') {
        res.json(resu);
      } else {
        res.json({message: 'You have not yet reviewed books'});
      }
    }
  )
});

userRouter.route('/register')
.post(async (req, res, next) => {

  var name = await User.findOne({name: req.body.name});
  if (name) return res.status(400).json({error: 'Name already used!'});

  if (req.body.admin) var admin = true;

  var salt = await bcrypt.genSalt(10);
  var password = await bcrypt.hash(req.body.password, salt);

  var user = new User({
    name: req.body.name,
    admin: admin,
    password,
  });

  try {
    const savedUser = await user.save();
    res.json({  userId: savedUser._id, message: 'Registeration complete' });
  } catch (error) {
    res.status(400).json({ error });
  }
});


userRouter.route('/login')
.post(async (req, res, next) => {

  var user = await User.findOne({ name: req.body.name });
  if (!user)  return res.status(400).json({ error: "Name is wrong" });

  var validPassword = bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json({ error: "Password is wrong" });

  var token = authenticate.login(user);
  res.header("auth-token", token).json({token});
});

userRouter.route('/logout')
.get((req, res, next) => {

  if (authenticate.getUser(req.header("auth-token")) !== null) {
    delete req.headers["auth-token"];
  }
  res.redirect('back');
});

module.exports = userRouter;
