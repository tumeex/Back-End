const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var commentSchema = new Schema({
    comment:  {
        type: String
    },
    star:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }
}, {
    timestamps: true
});

var Comments = mongoose.model('Comment', commentSchema);

module.exports = Comments;