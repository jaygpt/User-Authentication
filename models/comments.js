var mongoose = require('mongoose');

var comments = mongoose.Schema({
	commentor: String,
    comments:{
        type: String
    }
});

module.exports = comments;
