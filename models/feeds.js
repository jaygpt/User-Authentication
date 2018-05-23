const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var comments = require('./comments');
const feed = new Schema({
    sender: String,
    message: {
            type: String,
    },
    comments : [comments]
});

module.exports = feed;