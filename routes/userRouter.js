const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/users');
const authenticate = require('../authenticate');
const bcrypt = require("bcryptjs");

const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.route('/')
.get(authenticate.verifyUser, (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json('Welcome to your page ' + req.user.name);
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
  if (!user)  return res.status(400).json({ error: "Email is wrong" });

  var validPassword = bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json({ error: "Password is wrong" });

  var token = authenticate.login(user);
  res.header("auth-token", token).json({token});
});

module.exports = userRouter;
