const express = require('express');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
const authenticate = require('../authenticate');
const findB = require('../queries/findBook');
const findR = require('../queries/findReview');
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
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Books.create(req.body)
    .then((books) => {
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
    Reviews.aggregate(findR.findBookReviews(id),
        function (err, resu) {
          if (resu != '') {
            res.json(resu);
          } else {
            res.json('No book reviews found');
          } 
        }
    )
})
.post(authenticate.verifyUser, async (req, res, next) => {
    var id = authenticate.getUser(req.header("auth-token")).id;
    var userId = mongoose.Types.ObjectId(id);
    var bookId = mongoose.Types.ObjectId(req.params.booksId);
    const review = new Reviews({
      comment: req.body.comment,
      star: req.body.star,
      user: userId,
      book: bookId
    });
    try {
      const savedRev = await review.save();
      res.json({  savedRev });
    } catch (error) {
      res.status(400).json({ error });
    }
});

booksRouter.route('/:booksId/comments/:commentId')
.get((req,res,next) => {
    var id = req.params.commentId;
    Reviews.findById(id,
        function (err, resu) {
          if (resu != '') {
            res.json(resu);
          } else {
            res.json('Review was not found');
          } 
        }
    )
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  var id = req.params.commentId;
  var review = Reviews.findById(id);
  var user = authenticate.getUser(req.header("auth-token"));
  if (user.id == review.user || user.admin) {
    Books.findByIdAndRemove(req.params.booksId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
  } else {
    res.json('Only authors can remove reviews');
  }
});

module.exports = booksRouter;