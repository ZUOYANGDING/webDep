var express             =   require('express');
var userRouter    =   express.Router();
var Campgrounds         =   require('../models/campground');
var Comment             =   require('../models/comment');
var User                =   require('../models/user');
var passport            =   require('passport');
var midware             =   require('../midware/index');

// register router
userRouter.get('/register', function(req, res, next) {
    res.render('register');
});

userRouter.post('/register', function(req, res, next) {
    var newUser = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        avatar: req.body.avatar
    });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/register");
            return res.render('register');
        } else {
            passport.authenticate('local')(req, res, ()=>{
                req.flash("success", "Welcome to YelpCamp " + user.username);
                res.redirect('/campgrounds');
            });
        }
    });
});
 
// edit user's profile router
userRouter.get('/users/:id/edit', midware.isLoginUser, function(req, res, next) {
    res.render('users/edit', {user: req.user});
});

userRouter.put('/users/:id', midware.isLoginUser, function(req, res, next){
    User.findByIdAndUpdate(req.params.id, req.body.user).then(function(user) {
        req.flash("success", "Update your information successfully!");
        console.log("update successful");
        res.redirect('/users/' + req.params.id);
    }).catch((err)=>{
        console.log(err);
        req.flash("error", err.message);
        res.redirect("back");
    });
});

// login router
userRouter.get('/login', function(req, res, next) {
    res.render('login');
});

userRouter.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    successFlash: "Log you in successfully!",
    failureRedirect: '/login',
    failureFlash: true
    }), function(req, res, next) { 
});

// user profile page router
userRouter.get('/users/:id', midware.isLogin,function(req, res, next) {
    User.findById(req.params.id).then(function(user) {
        Campgrounds.find().where('author.id').equals(user._id).exec(function(err, campgrounds) {
            if (err) {
                req.flash("error", err.message);
                console.log(err);
                res.redirect("back");
            } else {
                res.render('users/show', {user: user, campgrounds:campgrounds});
            }
        })
    }).catch((err) => {
        req.flash("error", err.message);
        console.log(err);
        res.redirect("back");
    });
});




//logout router
userRouter.get('/logout', function(req, res, next) {
    req.flash("success", "Log you out successfully!");
    req.logout();
    res.redirect('/');
});

module.exports = userRouter;