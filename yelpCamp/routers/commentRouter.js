var express             =   require('express');
var commentRouter    =   express.Router({mergeParams: true});
var Campgrounds         =   require('../models/campground');
var Comment             =   require('../models/comment');
var User                =   require('../models/user');
var midware             =   require('../midware/index');

// routers for comments
commentRouter.get('/new', midware.isLogin, function(req, res, next) {
    Campgrounds.findById(req.params.id).then((campground) => {
        if (campground) {
            res.render("comments/new", {campground: campground});
        } else {
            req.flash("error", "Cannot find the matching CampGround!");
        }
    }).catch((err) => {
        console.log(err);
    })
});

commentRouter.post('/', midware.isLogin, function(req, res, next) {
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
                });
            }
        }).catch((err) => {
            console.log(err);
        });
        res.statusCode = 200;
        var redirectUrl = "/campgrounds/" + req.params.id;
        req.flash("success", "Comment post successfully!");
        res.redirect(redirectUrl);
    }).catch((err) => {
        req.flash("error", "Comment post failed!");
        console.log(err);
    })
});

// router for edit comment
commentRouter.get('/:commentId/edit', midware.isCommentPoster,function(req, res, next) {
    Comment.findById(req.params.commentId).then((comment) => {
        if (comment) {
            res.render('comments/edit', {comment:  comment, campgroundId: req.params.id});
        } else {
            req.flash("error", "Cannot find the comment!");
            res.redirect("back");
        }
    }).catch((err) => {
        console.log("err");
        res.redirect("back");
    })
});

commentRouter.put('/:commentId', midware.isCommentPoster,function(req, res, next) {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment).then((comment) => {
        if (comment) {
            console.log("comment update successful");
            req.flash("success", "Update your comment successfully!");
            res.redirect('/campgrounds/' + req.params.id);
        } else {
            req.flash("error", "Cannot find the comment!");
            res.redirect("back");
        }
    }).catch((err) => {
        console.log(err);
        req.flash("error", "Update your comment failed!");
        res.redirect('/campgrounds/' + req.params.id);
    });
});

// router for delete comment
commentRouter.delete('/:commentId', midware.isCommentPoster,function(req, res, next) {
    Campgrounds.findById(req.params.id).then(function(campground) {
        var index = 0;
        var commentid = String(req.params.commentId);
        for (var i=0; i<campground.comments.length; i++) {
            var id = (campground.comments[index]).toString();
            if  (id === commentid) {
                break;
            } else {
                index++;
            }
        }
        campground.comments.splice(index, 1);
        campground.save().then(function(campground) {
            console.log("remove the commentid from the campgrouds");
        })
        
    }).then(Comment.findByIdAndRemove(req.params.commentId).then((result) => {
        console.log(result);
        req.flash("success", "Delete your comment successfully!");
        res.redirect('/campgrounds/' + req.params.id);
    }).catch((err) => {
        req.flash("error", "Delete your comment failed!");
        console.log(err);
    })).catch((err) => {
        console.log(err);
    });
});

module.exports = commentRouter;