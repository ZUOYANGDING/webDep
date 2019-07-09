var express             =   require('express');
var commentRouter    =   express.Router({mergeParams: true});
var Campgrounds         =   require('../models/campground');
var Comment             =   require('../models/comment');
var User                =   require('../models/user');

// routers for comments
commentRouter.get('/new', isLogin, function(req, res, next) {
    Campgrounds.findById(req.params.id).then((campground) => {
        if (campground) {
            res.render("comments/new", {campground: campground});
        }
    }).catch((err) => {
        console.log(err);
    })
});

commentRouter.post('/', isLogin, function(req, res, next) {
    Comment.create(req.body.comment).then((comment) => {
        Campgrounds.findById(req.params.id).then((campground) => {
            if (campground) {
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save().then((comment) => {
                    campground.comments.push(comment);
                    campground.save().then((campground) => {
                        console.log("add comment success");
                    }).catch((err) => {
                        console.log(err);
                    });
                }).catch((err) => {
                    console.log(err);
                })
                // campground.comments.push(comment);
                // campground.save().then((campground) => {
                //     console.log("add comment success");
                // }).catch((err) => {
                //     console.log(err);
                // });
            }
        }).catch((err) => {
            console.log(err);
        });
        res.statusCode = 200;
        var redirectUrl = "/campgrounds/" + req.params.id;
        res.redirect(redirectUrl);
    }).catch((err) => {
        console.log(err);
    })
});

//funciton for auth check
function isLogin(req, res, next){
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports = commentRouter;