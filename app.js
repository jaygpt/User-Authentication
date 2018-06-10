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
const methodOverride = require('method-override');
const upload = require('express-fileupload');
var compression = require('compression');
var helmet = require('helmet');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://jaygpt:Qwert12345@ds011268.mlab.com:11268/departmental_portal_iitk');
var db = mongoose.connection;
var senior = require('./routes/senior');
var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var home = require('./routes/home');
var group = require('./routes/group');
var chat = require('./routes/chat');
var profile = require('./routes/profile');
var course = require('./routes/course');
var coursera = require('./routes/coursera');
var doubt = require('./routes/doubt');
var student = require('./routes/student');
//initialising the app
var app = express();
//app.use(upload());
app.use(methodOverride('_method'));
// View Engine
app.set('views', path.join(__dirname, 'views'));
const {select,isequal} = require('./helpers/handlebar-helper');
app.engine('handlebars',exphbs({defaultLayout: 'layout', helpers: {select:select,isequal: isequal,isEqual: isequal}}));
hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'handlebars');
// For secuirity
app.use(compression());
app.use(helmet());
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
    res.locals.mes = req.mes || null;
next();
});
//routing file

app.use('/', routes);
app.use('/users', users);
app.use('/admin',admin);
app.use('/home',home);
app.use('/group',group);
app.use('/chat',chat);
app.use('/profile',profile);
app.use('/senior',senior);
app.use('/course',course);
app.use('/coursera',coursera);
app.use('/search',student);
app.use('/doubt',doubt);
app.use(function(req,res){
    res.render('404err');
});
// Set Port
app.set('port', (process.env.PORT || 3000));
var server = app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
var io = socketIO(server);
require('./socket/groupchat.js')(io,Users);
require('./socket/privatemessage.js')(io,Users);