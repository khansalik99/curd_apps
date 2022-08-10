const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    // _id: {
    //     type: Schema.Types.ObjectId,
    //     required: false
    // },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Category', categorySchema);