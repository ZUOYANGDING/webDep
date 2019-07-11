var express             =   require('express');
var campgroundRouter    =   express.Router();
var Campgrounds         =   require('../models/campground');
var Comment             =   require('../models/comment');
var User                =   require('../models/user');

campgroundRouter.get('/', function(req, res, next) {
    Campgrounds.find({}).then((campgrounds) => {
        res.render("campgrounds/index", {campgrounds:campgrounds});
    }).catch((err) => {
        console.log(err);
    });
});

campgroundRouter.post('/', isLogin, function(req, res, next) {
    Campgrounds.create(req.body).then((campground) => {
        campground.author.id = req.user._id;
        campground.author.username = req.user.username;
        campground.save().then((campground) => {
            console.log(campground);
        }).catch((err) => {
            console.log(err);
        })
        res.statusCode = 200;
        res.redirect('/campgrounds');
    }).catch((err) => {
        console.log(err);
    });
});

campgroundRouter.get('/new', isLogin, function(req, res, next) {
    res.render("campgrounds/new");
});

campgroundRouter.get('/:id', function(req, res, next) {
    Campgrounds.findById(req.params.id).populate("comments").then(function(campground) {
        res.render("campgrounds/show", {campground: campground});
    }).catch((err) => {
        console.log(err);
    });
});


// router for edit page
campgroundRouter.get('/:id/edit', isThePoster, function(req, res, next) {
    Campgrounds.findById(req.params.id).then(function(campground) {
        res.render("campgrounds/edit", {campground: campground});
    }).catch((err) => {
        console.log(err);
        res.redirect("back");
    });
});

campgroundRouter.put('/:id', isThePoster, function(req, res, next) {
    Campgrounds.findOneAndUpdate(req.params.id, req.body.campground).then((campground) => {
        console.log("update successful");
        res.redirect("/campgrounds/" + req.params.id);
    }).catch((err) => {
        console.log(err);
        res.redirect("/campgrounds/" + req.params.id);
    });
});

// router for delete
campgroundRouter.delete('/:id', isThePoster, function(req, res, next) {
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
        res.redirect('/campgrounds');
    }).catch((err) => {
        console.log(err);
    })).catch((err) => {
        console.log(err);
    });
});


//funciton for login check
function isLogin(req, res, next){
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

//midware for auth check
function isThePoster(req, res, next) {
    if (req.isAuthenticated()) {
        Campgrounds.findById(req.params.id).then((campground) => {
            if (campground.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
        }).catch((err) =>{
            console.log(err);
            res.redirect("back");
        });
    } else {
        res.redirect("back");
    }
}

module.exports = campgroundRouter;