const mongoose = require('mongoose');
var comments = require('./comments');
const feed = new mongoose.Schema({
    sender: String,
    message: {
            type: String,
    },
    image: {
        type : String,
    },
    comments : [comments]
});

module.exports = feed;