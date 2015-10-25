var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
console.log(cookieParser);
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
app.use(express.static(path.join(__dirname, 'output')));

//mongo connection
var Mongo = require('./mongo');
var MongoStore = require('connect-mongo')(session);
var MSoptions = {mongooseConnection: Mongo.mongoose.connection};


//set up sessions
app.use(cookieParser());
app.use(session({
  secret: 'the cat in the hat has a hammock out back',
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 365*24*60*60*1000},
  store: new MongoStore(MSoptions)
}));

//set up passport
passport.use(new LocalStrategy(
  function(username, password, cb) {
    Mongo.User.findOne({username: username}, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  Mongo.User.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());



app.get('/', function(req, res){
    console.log("jello");
    res.redirect('/index.html');
});



app.post('/signup',function(req, res){
    var username = req.body.username;
    var password = req.body.password;

    if (username && password){
        Mongo.User.create({username: username, password: password});
        res.redirect('/login.html');
    } else {
        res.send('Error Creating Account');
    }

});

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login.html' }),
  function(req, res) {
    res.redirect('/success');
  });

  app.get('/success',
  ensureLoggedIn('/login'),
  function(req, res) {
    res.send(req.user);
  });

app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404).send('404 Not Found!');
});








// /// error handlers
//
// // development error handler
// // will print stacktrace
//
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err,
//             title: 'error'
//         });
//     });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {},
//         title: 'error'
//     });
// });
//



module.exports = app;

//GET THE APP TO listen
require('./bin/www');
