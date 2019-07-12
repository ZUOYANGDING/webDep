var express             =   require('express');
var campgroundRouter    =   express.Router();
var Campgrounds         =   require('../models/campground');
var Comment             =   require('../models/comment');
var User                =   require('../models/user');
var midware             =   require('../midware/index');

campgroundRouter.get('/', function(req, res, next) {
    Campgrounds.find({}).then((campgrounds) => {
        res.render("campgrounds/index", {campgrounds:campgrounds});
    }).catch((err) => {
        req.flash("error", "404 NOT FOUND!");
        console.log(err);
    });
});

campgroundRouter.post('/', midware.isLogin, function(req, res, next) {
    Campgrounds.create(req.body).then((campground) => {
        campground.author.id = req.user._id;
        campground.author.username = req.user.username;
        campground.save().then((campground) => {
            console.log(campground);
        }).catch((err) => {
            console.log(err);
        })
        res.statusCode = 200;
        req.flash("success", "Post CampGround successfully!");
        res.redirect('/campgrounds');
    }).catch((err) => {
        console.log(err);
    });
});

campgroundRouter.get('/new', midware.isLogin, function(req, res, next) {
    res.render("campgrounds/new");
});

campgroundRouter.get('/:id', function(req, res, next) {
    Campgrounds.findById(req.params.id).populate("comments").then(function(campground) {
        if (campground){
            res.render("campgrounds/show", {campground: campground});
        } else {
            req.flash("error", "Cannot find this CampGround!");
            res.redirect("back");
        }
    }).catch((err) => {
        console.log(err);
    });
});


// router for edit page
campgroundRouter.get('/:id/edit', midware.isCampGroundPoster, function(req, res, next) {
    Campgrounds.findById(req.params.id).then(function(campground) {
        if (campground) {
            res.render("campgrounds/edit", {campground: campground});
        } else {
            req.flash("error", "Cannot find this CampGround!");
            res.redirect("back");
        }
    }).catch((err) => {
        console.log(err);
        res.redirect("back");
    });
});

campgroundRouter.put('/:id', midware.isCampGroundPoster, function(req, res, next) {
    Campgrounds.findByIdAndUpdate(req.params.id, req.body.campground).then((campground) => {
        console.log("update successful");
        console.log(campground._id);
        req.flash("success", "Update your post successfully!");
        res.redirect("/campgrounds/" + req.params.id);
    }).catch((err) => {
        console.log(err);
        req.flash("error", "Update your post failed!");
        res.redirect("/campgrounds/" + req.params.id);
    });
});

// router for delete
campgroundRouter.delete('/:id', midware.isCampGroundPoster, function(req, res, next) {
    Campgrounds.findById(req.params.id).then((campground) => {
        if (campground) {
            var comments = campground.comments;
            for (var i=comments.length-1; i>=0; i--) {
                Comment.findByIdAndRemove(comments[i]).then((result) => {
                    console.log("comment delete successful" + result);
                }).catch((err) => {
                    console.log(err);
                });
            }
        }
        
    }).then(Campgrounds.findByIdAndRemove(req.params.id).then((result) => {
        console.log("delete campground successful" + result);
        req.flash("success", "Delete your post successfully!");
        res.redirect('/campgrounds');
    }).catch((err) => {
        req.flash("error", "Delete your post failed!");
        console.log(err);
    })).catch((err) => {
        console.log(err);
    });
});

module.exports = campgroundRouter;