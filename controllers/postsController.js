var Post = require("../models/post")
var async = require('async');
const { body,validationResult } = require('express-validator');
const { DateTime } = require("luxon");
var Account = require("../models/account")


exports.create_post = [

    body("title").trim().isLength({min: 3}).escape(),
    body("content").trim().isLength({min: 2}).escape(),
    body("id").escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('/');
            return;
        }
        
        var post = new Post({
            title: req.body.title,
            content: req.body.content,
            date: Date.now(), 
            author: req.body.id,
        })
       post.save(function (err) {
            if (err) { return next(err); }
            // Genre saved. Redirect to genre detail page.
            res.redirect("/");
          });
    }
]

exports.get_post_list = async function (req, res, next) {
    if (req.user){
        var post_by_user = await Post.countDocuments({author: req.user._id})
    }
    else{
        var post_by_user = 0;
    }
    async.parallel({
        post_list: function(callback){
            Post
                .find({})
                .sort({date: 1})
                .populate("author")
                .exec(callback);
        },
        post_amount: function (callback) {
            Post.countDocuments({}, callback)
        },
        total_members: function (callback) {
            Account.countDocuments({member: true}, callback)
        },
    }, function(err, results){
        res.render("index", { posts: results.post_list, post_amount: results.post_amount, post_by_user: post_by_user, total_members: results.total_members})
    });
}

exports.delete_post = function ( req, res, next){

    Post.findByIdAndDelete(req.body.id, function deletePost(err){
        if (err) { return next(err); }
        res.redirect("/");
    })
}