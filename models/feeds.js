const mongoose = require('mongoose');
var comments = require('./comments');
const feed = new mongoose.Schema({
    sender: String,
    message: {
            type: String,
    },
    comments : [comments]
});

module.exports = feed;