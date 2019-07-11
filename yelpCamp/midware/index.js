var Campgrounds     =       require('../models/campground');
var Comment         =       require('../models/comment');

var midwareObj = {}


//funciton for login check
midwareObj.isLogin = function (req, res, next){
    if (req.isAuthenticated()) {
        next();
    } else {
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
                res.redirect("back");
            }
        })
    } else {
        res.redirect("back");
    }
}


// router for campground auth check
midwareObj.isCampGroundPoster = function (req, res, next) {
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

module.exports = midwareObj;