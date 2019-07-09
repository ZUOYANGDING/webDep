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

//funciton for auth check
function isLogin(req, res, next){
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports = campgroundRouter;