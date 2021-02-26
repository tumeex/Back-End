var http = require('http');
var express = require('express');
var config = require('./config');
var passport = require('passport');

var indexRouter = require('./routes/indexRouter');
var booksRouter = require('./routes/booksRouter');
var userRouter = require('./routes/userRouter');

var app = express();

// database
const mongoose = require('mongoose');
const url = config.mongoUrl;
const connect = mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });

// http
var port = (process.env.PORT || '3000');
app.set('port', port);
var server = http.createServer(app);
server.listen(port);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/home', userRouter);

module.exports = app;