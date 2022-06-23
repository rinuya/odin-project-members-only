const { Router } = require('express');
var express = require('express');
var router = express.Router();
const passport = require('passport');
var account_controller = require("../controllers/accountController");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: req.user });
});

//on create blog post
router.post('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// get account page
router.get("/account/:id", function(req, res, next){
  res.render("account", {  })
});

// submit secret password
router.post("/account/:id", function(req, res, next){
  res.render("account", {})
});

// get sign in page
router.get("/signin", function(req, res, next){
  res.render("signin", { customerr: "", customerrarray: [] })
});

router.post("/signin",   
passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/signin"
})
); 

// get sign up page
router.get("/signup", function(req, res, next){
  res.render("signup", { customerr: "", customerrarray: [], account: "" })
});

// post sign up 
router.post("/signup", account_controller.signup_post);




module.exports = router;
