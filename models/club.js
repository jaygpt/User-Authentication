var mongoose = require('mongoose');
var postSchema = require('./post');
var fans = require('./fans');
var clubNames = mongoose.Schema({
	
    name: {
		type: String,
        default: '',
        required : ['True','Name is required']
	},
	positioninclub: {
        type: String,
        default: ''
    },
//	image: {
//		type: String,
//        default: 'default.png'
//	},
    post : [postSchema],
    fans: [fans],
    description:{
        type: String,
        default: ''
    }
});

var Club = module.exports = mongoose.model('Club', clubNames);

//Fist connect our data base of clubs to admin