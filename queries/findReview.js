module.exports = {
    findUserReviews: function (id) {
        var query = 
        [
            {
                "$match": {
                    "user": id
                }
            }
        ];
        return query;
    },
    
    findBookReviews: function (id) {
        var query = 
        [
            {
                "$match": {
                    "book": id
                }
            }
        ];
        return query;
    }
};