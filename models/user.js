var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
    },
    secretToken: {
        type: String,
    },
    flag: {
        type: Boolean
    },
	email: {
		type: String,
        unique: true
	},
	name: {
		type: String,
	},
    department: {
		type: String,
		required: true
	},
	year:{
        type: String,
    },
    club:{
        type: String
    },
    profile:{
        image:{
            type: String
        },
        bio:{
            type: String
        },
        room:{
            type:String
        },
        club:{
            type:String
        },
        position:{
            type:String
        },
        project:{
            type:String
        },
        clubi:{
            type:String
        },
        pastprojects:{
            type:String
        },
        intern:{
            type:String
        },
        sports:{
            type:String
        }
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}