var Account = require("../models/account")
var async = require('async');
const { body,validationResult } = require('express-validator');

const passport = require("passport");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;

exports.signup_post = [
    
    body("username", "Username must not be empty and longer than 3 characters").trim().isLength({min: 3}).escape(),
    body("email", "Email must be valid").trim().isLength({min: 1}).escape(),
    body("password", "Password too short").trim().isLength({min: 8}).escape(),
    body("confirmpassword", "Passwords don't match").trim().isLength({min: 1}).escape(),

    
    (req, res, next)=>{
        console.log("Got through the body verification");
        const errors = validationResult(req);
        // Creating account without password to fill it in the form in case of error
        
        var account = new Account({
            username: req.body.username,
            email: req.body.email,
        })
        // If passwords dont match
        if (req.body.password !== req.body.confirmpassword){
            console.log("Passwords dont match");
            res.render("signup", {account: account, customerr: "Passwords don't match!",errors: errors.array()})
            return;
        }
        //If username already exits
        else if(Account.findOne({username: account.username})){
            console.log("Username already exits");
            res.render("signup", {account: account, customerr: "User with this username already exists!",errors: errors.array()})
            return;
        }
        //If email already exists
        else if(Account.findOne({email: account.email})){
            console.log("Email already exists");
            res.render("signup", {account: account, customerr: "User with this email already exists!",errors: errors.array()})
            return;
        }
        else {
            console.log("Should be saving now");
            bcrypt.hash(req.body.password, 10, (err, hashedPw)=>{
                if(err){return next(err)}
                //if everything hashed smoothly, we get the following
                const successAccount = new Account({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPw,
                    member: false,
                }).save(err=>{
                    if (err){ return next(err);};
                    console.log("Success! Data saved")
                    res.redirect("/signin")
                })
            })
        }

    }
]