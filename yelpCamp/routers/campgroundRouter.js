var express             =   require('express');
var campgroundRouter    =   express.Router();
var Campgrounds         =   require('../models/campground');
var Comment             =   require('../models/comment');
var User                =   require('../models/user');
var midware             =   require('../midware/index');
var NodeGeoCoder        =   require('node-geocoder');

var option              =   {
                            provider: 'google',
                            httpAdapter: 'https',
                            apiKey: process.env.GEOCODER_API_KEY,
                            formatter: null
};

var geocoder = NodeGeoCoder(option);


campgroundRouter.get('/', function(req, res, next) {
    var noMatch = null;
    if (req.query.search) {
        const result = new RegExp(escapeRegex(req.query.search), 'gi');
        Campgrounds.find({name: result}).then((campgrounds) => {
            if (campgrounds.length > 0) {
                res.render('campgrounds/index', {campgrounds:campgrounds, noMatch:noMatch});
            } else {
                noMatch = "There is no matching result for your search. Please try again";
                res.render('campgrounds/index', {campgrounds:campgrounds, noMatch: noMatch});
            }
        }).catch((err) => {
            console.log(err);
            req.flash("error", err.message);
        });
    } else {
        Campgrounds.find({}).then((campgrounds) => {
            res.render("campgrounds/index", {campgrounds:campgrounds, noMatch: noMatch});
        }).catch((err) => {
            req.flash("error", "404 NOT FOUND!");
            console.log(err);
        }); 
    }
    // Campgrounds.find({}).then((campgrounds) => {
    //     res.render("campgrounds/index", {campgrounds:campgrounds});
    // }).catch((err) => {
    //     req.flash("error", "404 NOT FOUND!");
    //     console.log(err);
    // });
});

campgroundRouter.post('/', midware.isLogin, function(req, res, next) {
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    
    geocoder.geocode(req.body.location).then(function(position) {
        if (position.length > 0) {
            var locationName = position[0].formattedAddress;
            var lat = position[0].latitude;
            var lgn = position[0].longitude;
            console.log(lat+ " " + lgn);
            var newCampground = {
                name: name,
                image: image,
                price: price,
                description: description,
                author: author,
                location: {
                    name: locationName,
                    lat: lat,
                    lgn: lgn
                }
            }
            Campgrounds.create(newCampground).then((campground) => {
                // campground.author.id = req.user._id;
                // campground.author.username = req.user.username;
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
        } else {
            req.flash("error", "Cannot find the postion by google map");
            res.redirect("back");
        }
    }).catch((err)=>{
        req.flash("error", err.message);
        console.log(err);
        res.redirect("back");   
    })
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
    geocoder.geocode(req.body.location).then(function (position) {
        var name = req.body.campground.name;
        var image = req.body.campground.image;
        var price = req.body.campground.price;
        var description = req.body.description;
        var author = {
            id: req.user._id,
            username: req.user.username
        }
        if (position.length > 0) {
            var lat = position[0].latitude;
            var lgn = position[0].longitude;
            var locationName = position[0].formattedAddress;
            var updateCampground = {
                name: name,
                image: image,
                price: price,
                description: description,
                author: author,
                location: {
                    name: locationName,
                    lat: lat,
                    lgn: lgn
                }
            }
            Campgrounds.findByIdAndUpdate(req.params.id, updateCampground).then((campground) => {
                console.log("update successful");
                // console.log(campground.price);
                // console.log(req.body.campground);
                req.flash("success", "Update your post successfully!");
                res.redirect("/campgrounds/" + req.params.id);
            }).catch((err) => {
                console.log(err);
                req.flash("error", "Update your post failed!");
                res.redirect("/campgrounds/" + req.params.id);
            });
        } else {
            req.flash("error", "Cannot find the location from google map");
            res.redirect("back");
        }
    }).catch((err)=> { 
        req.flash("error", err.message);
        console.log(err);
        res.redirect("back");
    })
    // Campgrounds.findByIdAndUpdate(req.params.id, req.body.campground).then((campground) => {
    //     console.log("update successful");
    //     // console.log(campground.price);
    //     // console.log(req.body.campground);
    //     req.flash("success", "Update your post successfully!");
    //     res.redirect("/campgrounds/" + req.params.id);
    // }).catch((err) => {
    //     console.log(err);
    //     req.flash("error", "Update your post failed!");
    //     res.redirect("/campgrounds/" + req.params.id);
    // });
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


// function for regular expression match
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = campgroundRouter;