var Account = require("../models/account");
var Post = require("../models/post")
var async = require('async');
const { body,validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
require('dotenv').config();

exports.signup_post = [
    
    body("username", "Username must not be empty and longer than 3 characters!").trim().isLength({min: 3}).escape(),
    body("email", "Email must be valid!").trim().isLength({min: 1}).escape(),
    body("password", "Password too short!").trim().isLength({min: 8}).escape(),
    body("confirmpassword", "You need to confirm the password!").trim().isLength({min: 1}).escape(),

    async (req, res, next)=>{
        const errors = validationResult(req);
        // Creating account without password to fill it in the form in case of error
        var account = new Account({
            username: req.body.username,
            email: req.body.email,
        })

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('signup', { account: account, customerr: "", customerrarray: errors.array() });
            return;
          }
        // If passwords dont match
        if (req.body.password !== req.body.confirmpassword){
            res.render("signup", { account: account, customerr: "Passwords don't match!", customerrarray: errors.array()})
            return;
        }
        // If username already exits
        const usernameExists = await Account.exists({username: req.body.username});
        if (usernameExists) {
            res.render("signup", {account: account, customerr: "User with this username already exists!",  customerrarray: errors.array()})
            return; 
        }
        // If email already exists
        const emailExists = await Account.exists({email: req.body.email});
        if (emailExists) {
            res.render("signup", {account: account, customerr: "User with this email already exists!",  customerrarray: errors.array()})
            return;
        }
        // If everything is allright
        if (!usernameExists && !emailExists){
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
                    res.redirect("/signin")
                })
            })
        } 
    }
]

exports.secret_password = [
    body("secretpassword").trim().escape(),
    async (req, res, next)=>{

        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            res.redirect("/account"); 
        }

        var pw = process.env.VERIFICATION_PASSWORD;

        if (req.body.secretpassword === pw) {
            const update = await Account.updateOne({_id: req.body.id}, {member: true});
            if (update){
                res.redirect("/");
            } else {
                res.redirect("/account");
            }
        }
        else {
            res.redirect("/account");
        }
    }
]


exports.account_posts = function (req, res, next) {

    Post.countDocuments({author: req.user._id}).exec(function (err, amount){
        if (err) { return next(err); }
        res.render("account", { post_amount: amount })
    })

}