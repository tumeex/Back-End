const express = require('express');
const bodyParser = require('body-parser');
const Books = require('../models/books');
const findB = require('../queries/findBook').findBestBook();
var indexRouter = express.Router();
indexRouter.use(bodyParser.json());

indexRouter.get('/', (req, res, next) => {
  
  Books.aggregate(findB,
    function (err, resu) {
      if (resu != '') {
        res.json(resu);
      } else {
        res.json('No books found');
      } 
    }
  )
});

module.exports = indexRouter;
