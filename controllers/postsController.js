var Post = require("../models/post")
var async = require('async');
const { body,validationResult } = require('express-validator');
const { DateTime } = require("luxon");


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

