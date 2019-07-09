var express             =   require('express');
var userRouter    =   express.Router();
var Campgrounds         =   require('../models/campground');
var Comment             =   require('../models/comment');
var User                =   require('../models/user');
var passport            =   require('passport');

// register router
userRouter.get('/register', function(req, res, next) {
    res.render('register');
});

userRouter.post('/register', function(req, res, next) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        } else {
            passport.authenticate('local')(req, res, ()=>{
                res.redirect('/campgrounds');
            });
        }
    });
});

// login router
userRouter.get('/login', function(req, res, next) {
    res.render('login');
});

userRouter.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
    }), function(req, res, next) { 
});

//logout router
userRouter.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

module.exports = userRouter;