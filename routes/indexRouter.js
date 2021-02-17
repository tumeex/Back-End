const express = require('express');
const bodyParser = require('body-parser');
const Books = require('../models/books');
const indQ = require('../queries/indexQuery');
var indexRouter = express.Router();
indexRouter.use(bodyParser.json());

indexRouter.get('/', (req, res, next) => {
  
  Books.aggregate(indQ,
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
