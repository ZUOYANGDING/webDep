var Campgrounds     =       require('../models/campground');
var Comment         =       require('../models/comment');
var User            =       require('../models/user')

var midwareObj = {}


//funciton for login check
midwareObj.isLogin = function (req, res, next){
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("error", "You need to to be logged in to do that!");
        res.redirect('/login');
    }
}

// function for comment auth check
midwareObj.isCommentPoster = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.commentId).then((comment) => {
            if (comment.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error", "You do not have permission to do that!");
                res.redirect("back");
            }
        }).catch((err) => {
            console.log(err);
            req.flash("error", "Cannot find this campground!");
            res.redirect("back");
        });
    } else {
        req.flash("error", "You need to to be logged in to do that!");
        res.redirect("back");
    }
}


// function for campground auth check
midwareObj.isCampGroundPoster = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campgrounds.findById(req.params.id).then((campground) => {
            if (campground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You do not have permission to do that!");
                res.redirect("back");
            }
        }).catch((err) =>{
            console.log(err);
            req.flash("error", "Cannot find this comment!");
            res.redirect("back");
        });
    } else {
        req.flash("error", "You need to to be logged in to do that!");
        res.redirect("back");
    }
}

// function for user profile page
midwareObj.isLoginUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        User.findById(req.params.id).then((user) => {
            if (user._id.equals(req.user._id)) {
                next();
            } else {
                req.equals("error", "You do not have permission to do that!");
                res.redirect("back");
            }
        }).catch((err)=>{
            console.log(err);
            req.flash("error", "Cannot find the user");
            req.redirect("back");
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

module.exports = midwareObj;