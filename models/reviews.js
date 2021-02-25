const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var reviewSchema = new Schema({
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
        ref: 'User',
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    }
}, {
    timestamps: true
});

var Reviews = mongoose.model('Review', reviewSchema);

module.exports = Reviews;