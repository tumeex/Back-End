const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const bookQ = require('../queries/booksQuery');
const Books = require('../models/books');

const booksRouter = express.Router();

booksRouter.use(bodyParser.json());

booksRouter.route('/')
.get((req,res,next) => {
    Books.aggregate(bookQ,
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
    Books.create(req.body)
    .then((books) => {
        console.log('Promotion Created ', books);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(books);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /books');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Books.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

booksRouter.route('/:booksId')
.get((req,res,next) => {
    Books.findById(req.params.booksId)
    .then((books) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(books);
    }, (err) => next(err))
    .catch((err) => next(err));
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