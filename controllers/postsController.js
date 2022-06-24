var Post = require("../models/post")
var async = require('async');
const { body,validationResult } = require('express-validator');
const { DateTime } = require("luxon");


exports.create_post = [
    body("title").trim().isLength({min: 3}).escape(),
    body("content").trim().isLength({min: 2}).escape(),

    async (req, res, next)=>{
        const errors = validationResult(req);

        var post = new Post({
            title: req.body.title,
            content: req.body.content,
            date: Date.now , 
            author: 0,
        })
    }
]