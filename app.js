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
const Account = require("./models/account");
const bcrypt = require("bcryptjs");

var indexRouter = require('./routes/index');

//Production imports
var compression = require('compression');
var helmet = require('helmet');

var app = express();

app.use(helmet());

//Here is where the database connection should be, NOT MADE BY EXPRESS
var mongoDB = process.env.DB_KEY;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(compression()); //Compress all routes
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Here is where the session setup should be, NOT MADE BY EXPRESS
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// currentUser should be variable available now 
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

//Authentication

//Cannot use email here by default. LocalStrategy expects it to be the username. Based on a Stack Overflow answer:
// https://stackoverflow.com/questions/18138992/use-email-with-passport-local-previous-help-not-working
//
// It seems to me you just changed the name of the argument in the LocalStrategy callback to "email". Passport doesn't automagically know that the field is named email though, you have to tell it.
//
// By default, LocalStrategy expects to find credentials in parameters named username and password. If your site prefers to name these fields differently, options are available to change the defaults.

passport.use(
  new LocalStrategy((username, password, done) => {
    //Find the user in the database that matches the username, and call the function that will store the user Object in the result
    Account.findOne({ username: username }, (err, user) => {
      if (err) { 
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user)
        } else {
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

// loggin in
app.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signin"
  })
);


// logging out
app.get("/logout", (req, res)=>{
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
})
//Authentication part finished

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);


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
