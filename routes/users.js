var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');

var User = require('../models/user.js');

// Get register and logins
router.get('/register',function(req, res){
	res.render('register');
});

router.get('/errorpage',function(req, res){
	res.render('errorpage');
});


router.post('/register',function(req,res){
    var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
    var password2 = req.body.password2;
    var department = req.body.department;
    req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('department', 'Please Enter your department').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    
    var errors = req.validationErrors();
    
    if(errors){
        res.render('register',{
            errors:errors
        });
    }
    else{
        var newUser = new User({
        name: name,
        email: email,
        password: password,
        username: username,
        department: department
        });
        
        User.createUser(newUser, function (err, user) {
            if (err) throw err;
            //console.log(user);
        });
         	req.flash('success_msg', 'You are registered and can now login');
            res.redirect('/');
    }
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
}));
//For new users 
passport.serializeUser(function (user, done) {
	done(null, user.id);
});
//For old users and to make the login successful
passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
        var name = user.username;
        var department = user.department;
        module.exports.myname = function(){
            return name;
        }
        module.exports.mydepartment = function(){
            return department;
        }
        //console.log(user.name);

        //module.exports = name;
		done(err, user);
	});
});
//var myname = function(){
//    return name;
//};
//console.log(myname());
router.post('/login',
	passport.authenticate('local', { successRedirect: '/home', failureRedirect: '/users/errorpage', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});


router.get('/logout',function(req,res){
    req.logout();
    req.flash('success_msg','Your are successfully logged out');
    res.redirect('/');
})
module.exports = router;
//module.exports = myname;