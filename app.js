var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Custom imports, NOT MADE BY EXPRESS
require('dotenv').config();
const mongoose = require('mongoose');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
var Account = require("./models/account");
const bcrypt = require("bcryptjs");

var indexRouter = require('./routes/index');

var app = express();

//Here is where the database connection should be, NOT MADE BY EXPRESS
var mongoDB = process.env.DB_KEY;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Here is where the session setup should be, NOT MADE BY EXPRESS
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// currentUser variable is now available 
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

//Authentication
passport.use(
  new LocalStrategy((email, password, done) => {
    //Find the user in the database that matches the username, and call the function that will store the user Object in the result
    Account.findOne({ email: email }, (err, user) => {
      if (err) { 
        console.log("There has been an error");
        return done(err);
      }
      //if theres no user, he typed the user in incorrectly
      if (!user) {
        console.log("User not found");
        return done(null, false, { message: "Incorrect username" });
      }
      //compare the typed in password hash to the hash stored in the db
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          console.log("Logging in");
          // passwords match! log user in
          return done(null, user)
        } else {
          // passwords do not match!
          console.log("Wrong password");
          return done(null, false, { message: "Incorrect password!" })
        }
      })
    });
  })
);

passport.serializeUser(function(user, done) {
done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Account.findById(id, function(err, user) {
    done(err, user);
  });
});
//Authentication part finished

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
