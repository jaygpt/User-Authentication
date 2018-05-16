var mongoose = require('mongoose');

var clubNames = mongoose.Schema({
	myName:{
        type: String,
        default: '{{user.name}}'
    },
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
    fans: [{
    otherclubs: {type: String,default: ''},
        responsibility: {type: String,default: ''}
}]
});

var Club = module.exports = mongoose.model('Club', clubNames);

//Fist connect our data base of clubs to admin