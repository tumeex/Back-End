module.exports = {
    findBook: function (id) {
        var query = 
        [
            {
                "$lookup": {
                "from": "reviews", 
                "localField": "_id", 
                "foreignField": "book", 
                "as": "reviews"
                }
            }, {
                "$addFields": {
                "rating": {
                    "$avg": "$reviews.star"
                }, 
                "comments": {
                    "$size": "$reviews"
                }
                }
            }, {
                "$match": {
                "_id": id
                }
            }
        ];
        return query;
    },

    findAllBooks: function () {
        var query = [
            {
                "$lookup": {
                  "from": "reviews", 
                  "localField": "_id", 
                  "foreignField": "book", 
                  "as": "reviews"
                }
              }, {
                "$addFields": {
                  "rating": {
                    "$avg": "$reviews.star"
                  }, 
                  "comments": {
                    "$size": "$reviews"
                  }
                }
              }, {
                "$sort" : {
                    "rating": -1
                }
              }
        ];
        return query;
    },

    findBestBook: function () {
        var query = [
            {
                "$lookup": {
                  "from": "reviews", 
                  "localField": "_id", 
                  "foreignField": "book", 
                  "as": "reviews"
                }
              }, {
                "$addFields": {
                  "rating": {
                    "$avg": "$reviews.star"
                  }
                }
              }, {
                  "$sort" : {
                      "rating": -1
                  }
              },
              {
                  "$limit" : 1
              }
        ];
        return query;
    }
};