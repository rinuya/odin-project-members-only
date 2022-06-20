var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
  res.render("signin", {  })
});

// on signing in
router.post("/signin", function(req, res, next){
  res.render("signin", {  })
});

// get sign up page
router.get("/signup", function(req, res, next){
  res.render("signup", {  })
});

// on signing up
router.post("/signup", function(req, res, next){
  res.render("signup", {  })
});


module.exports = router;
