const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const songSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: false
    },
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    // categoryId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Category',
    //     required: true
    // }
    categoryId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Song', songSchema);