const express = require('express');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
const authenticate = require('../authenticate');
const findB = require('../queries/findBook');
const Books = require('../models/books');
const Reviews = require('../models/reviews');

const booksRouter = express.Router();

booksRouter.use(bodyParser.json());

booksRouter.route('/')
.get((req,res,next) => {
    Books.aggregate(findB.findAllBooks(),
        function (err, resu) {
          if (resu != '') {
            res.json(resu);
          } else {
            res.json('No books found');
          } 
        }
    )
})
.post((req, res, next) => {
    Books.create(req.body)
    .then((books) => {
        console.log('Book added: ', books);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(books);
    }, (err) => next(err))
    .catch((err) => next(err));
});

booksRouter.route('/:booksId')
.get((req,res,next) => {
    var id = mongoose.Types.ObjectId(req.params.booksId);
    Books.aggregate(findB.findBook(id),
        function (err, resu) {
          if (resu != '') {
            res.json(resu);
          } else {
            res.json('No books found');
          } 
        }
    )
    
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Books.findByIdAndRemove(req.params.booksId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

booksRouter.route('/:booksId/comments')
.get((req,res,next) => {
    var id = mongoose.Types.ObjectId(req.params.booksId);
    Books.aggregate(findB.findBook(id),
        function (err, resu) {
          if (resu != '') {
            res.json(resu);
          } else {
            res.json('No books found');
          } 
        }
    )
})
.post(authenticate.verifyUser, (req, res, next) => {
  Reviews.create(req.body)
  .then((books) => {
      console.log('Book added: ', books);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(books);
  }, (err) => next(err))
  .catch((err) => next(err));
});

booksRouter.route('/:booksId/comments/:commentId')
.get((req,res,next) => {
    var id = mongoose.Types.ObjectId(req.params.booksId);
    Books.aggregate(findB.findBook(id),
        function (err, resu) {
          if (resu != '') {
            res.json(resu);
          } else {
            res.json('No books found');
          } 
        }
    )
    
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Books.findByIdAndRemove(req.params.booksId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = booksRouter;