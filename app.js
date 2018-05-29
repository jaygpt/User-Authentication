var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var socketIO = require('socket.io');
var http = require('http');
var {Users} = require('./helpers/UserClass');
var user = require('./models/user');
var hbs = require('hbs');
mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var home = require('./routes/home');
var group = require('./routes/group');
var chat = require('./routes/chat');
//initialising the app
var app = express();
// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');
// exphbs.registerPartial('partial', fs.readFileSync(__dirname + '/views/partial.hbs', 'utf8'));
hbs.registerPartials(__dirname + '/views/partials');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));
//passport
app.use(passport.initialize());
app.use(passport.session());


// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
   res.locals.user = req.user || null;
    res.locals.resl = req.resl || null;
next();
});
//routing file

app.use('/', routes);
app.use('/users', users);
app.use('/admin',admin);
app.use('/home',home);
app.use('/group',group);
app.use('/chat',chat);

// Set Port
app.set('port', (process.env.PORT || 3000));
var server = app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
var io = socketIO(server);
require('./socket/groupchat.js')(io,Users);
require('./socket/privatemessage.js')(io,Users);