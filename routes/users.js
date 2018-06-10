var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var randomstring = require('randomstring');
var User = require('../models/user.js');
var mailer = require('../misc/mailer');


// Get register and logins
router.get('/register',function(req, res){
	res.render('register');
});
router.get('/login',function(req, res){
	res.render('login');
});

router.get('/errorpage',function(req, res){
	res.render('errorpage');
});
router.get('/verify',(req,res)=>{
    res.render('verify');
});
router.post('/verify',(req,res)=>{
    var secret = req.body.secretToken;
    User.findOne({'secretToken': secret})
        .then((found) => {
            if(!found){
                req.flash('error','This is an Invalid Verification code');
                res.redirect('/users/verify');
                return;
            }
            else{
                found.flag = true;
                found.secretToken = '';
                found.save();
                req.flash('success_msg','Now you can login');
                res.redirect('/users/login');
            }
        })
});

router.post('/register',function(req,res){
    var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
    var password2 = req.body.password2;
    var department = req.body.department;
    const secretToken = randomstring.generate();
    req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	//req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('department', 'Please Enter your department').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    var email2 = email + '@iitk.ac.in';
    var errors = req.validationErrors();
    
    if(errors){
        res.render('register',{
            errors:errors
        });
    }
    else{
        var newUser = new User({
        name: name,
        email: email2,
        password: password,
        username: username,
        department: department,
        secretToken: secretToken,
        flag: true
        });
        const html = `Hi there,
      <br/>
      Thank you for registering!
      <br/><br/>
      Please verify your email by typing the following token:
      <br/>
      Token: <b>${secretToken}</b>
      <br/>
      On the following page:
      <a href="http://localhost:3000/users/verify">http://localhost:5000/users/verify</a>
      <br/><br/>
      Have a pleasant day.`;

      // Send email
      mailer.sendEmail('admin@sandbox1b78d98d24094636bcd801883ae8350f.mailgun.org', email2, 'Please verify your email!', html);
        User.createUser(newUser, function (err, user) {
            if (err) throw err;
            //console.log(user);
        });
         	req.flash('success_msg', 'You are registered and now you can Verify using your IITK Email');
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
            if(!user.flag){
                return done(null, false, { message: 'You Have to verify first'});
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