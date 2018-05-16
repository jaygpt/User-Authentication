var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user.js');

// Get register and logins
router.get('/register',function(req, res){
	res.render('register');
});

router.get('/login',function(req, res){
	res.render('login');
});

router.post('/register',function(req,res){
    var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
    var password2 = req.body.password2;
    req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
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
        username: username
        });
        
        User.createUser(newUser, function (err, user) {
            if (err) throw err;
            console.log(user);
        });
         	req.flash('success_msg', 'You are registered and can now login');
            res.redirect('/users/login');
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
        console.log(user.name);
        exports.myname = user.name;
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/home', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

router.get('/logout',function(req,res){
    req.logout();
    req.flash('success_msg','Your are successfully logged out');
    res.redirect('/users/login');
})
module.exports = router;
