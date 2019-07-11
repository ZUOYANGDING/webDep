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
        res.redirect(redirectUrl);
    }).catch((err) => {
        console.log(err);
    })
});

// router for edit comment
commentRouter.get('/:commentId/edit', midware.isCommentPoster,function(req, res, next) {
    Comment.findById(req.params.commentId).then((comment) => {
        res.render('comments/edit', {comment:  comment, campgroundId: req.params.id});
    }).catch((err) => {
        console.log("err");
        res.redirect("back");
    })
});

commentRouter.put('/:commentId', midware.isCommentPoster,function(req, res, next) {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment).then((comment) => {
        console.log("comment update successful");
        res.redirect('/campgrounds/' + req.params.id);
    }).catch((err) => {
        console.log(err);
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
        res.redirect('/campgrounds/' + req.params.id);
    }).catch((err) => {
        console.log(err);
    })).catch((err) => {
        console.log(err);
    });
    // Comment.findByIdAndRemove(req.params.commentId).then((result) => {
    //     console.log(result);
    //     res.redirect('/campgrounds/' + req.params.id);
    // })
});

// //funciton for login check
// function isLogin(req, res, next){
//     if (req.isAuthenticated()) {
//         next();
//     } else {
//         res.redirect('/login');
//     }
// }

// // function for auth check
// function midware.isCommentPoster(req, res, next) {
//     if (req.isAuthenticated()) {
//         Comment.findById(req.params.commentId).then((comment) => {
//             if (comment.author.id.equals(req.user._id)){
//                 next();
//             } else {
//                 res.redirect("back");
//             }
//         })
//     } else {
//         res.redirect("back");
//     }
// }

module.exports = commentRouter;