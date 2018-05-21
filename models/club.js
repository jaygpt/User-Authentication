var mongoose = require('mongoose');
var postSchema = require('./post');
var clubNames = mongoose.Schema({
	
    name: {
		type: String,
        default: ''
	},
	positioninclub: {
        type: String,
        default: ''
    },
	image: {
		type: String,
        default: 'default.png'
	},
    post : [postSchema],
    fans: [{
        otherclubs: {type: String,default: ''},
        responsibility: {type: String,default: ''}
}]
});

var Club = module.exports = mongoose.model('Club', clubNames);

//Fist connect our data base of clubs to admin