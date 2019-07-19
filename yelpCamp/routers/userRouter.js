var express             =   require('express');
var userRouter    =   express.Router();
var Campgrounds         =   require('../models/campground');
var Comment             =   require('../models/comment');
var User                =   require('../models/user');
var passport            =   require('passport');
var midware             =   require('../midware/index');
var nodemailer          =   require('nodemailer');
var async               =   require('async');
var crypto              =   require('crypto');

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

// user forget password router
userRouter.get('/forget', function(req, res, next) {
    res.render('forget');
});

userRouter.post('/forget', function(req, res, next) {
    async.waterfall([
        // create the reset token
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        // set reset token in user model
        function(token, done) {
            User.findOne({email: req.body.email}).then(function(user) {
                if (!user) {
                    req.flash("error", "No account with this email address!");
                    return res.redirect('/forget');
                } else {
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000;
                    user.save(function(err) { 
                        done(err, token, user);
                    });
                }
            }).catch((err) => {
                console.log(err);
                req.flash("error", err.message);
            });
        },
        // sent resetpassword email
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: '307fall2018@gmail.com',
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: '307fall2018@gmail.com',
                subject: 'Password Reset E-Mail',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            }
            smtpTransport.sendMail(mailOptions, function(err) {
                console.log("send reset password email successfully");
                req.flash("success", "An e-mail has been sent to " + user.email + " with further instructions.");
                done(err, 'done')
            });
        }
    ], function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/forget');
    });
});

userRouter.get('/reset/:token', function(req, res, next) {
    User.findOne({
        resetPasswordToken: req.params.token, 
        resetPasswordExpires: {$gt: Date.now()}
    }).then(function(user) {
        res.render('reset', {token: req.params.token});
    }).catch((err) => {
        console.log(err);
        req.flash("error", err.message);
        res.render('/forget');
    });
});

userRouter.post('/reset/:token', function(req, res, next) {
    async.waterfall([
        // update password function
        function(done) {
            User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {$gt: Date.now()}
            }).then(function(user) {    
                if (!user) {
                    console.log("The reset token has been expired");
                    req.flash("error", "The reset token has been expired");
                    res.redirect("back");
                } else {
                    if (req.body.password === req.body.confirm) {
                        user.setPassword(req.body.password, function(err) {
                            if (err) {
                                console.log("salt hash password failed");
                                req.flash("error", err.message);
                                return res.redirect("back");
                            }
                            user.resetPasswordToken = undefined;
                            user.resetPasswordExpires = undefined;
                            user.save(function(err) {
                                if (err) {
                                    console.log("Update password failed!");
                                    req.flash("error", err.message);
                                    res.redirect("back");
                                } else {
                                    done(err, user);
                                    return res.redirect('/login');
                                }
                            }); 
                        });
                    } else {
                        req.flash("error", "Confirmed password does not match");
                        return res.redirect("back");
                    }
                }
            }).catch((err) => {
                console.log(err);
                req.flash("error", err.message);
                res.redirect("back");
            });
        },
        // confirm email send
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: '307fall2018@gmail.com',
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: '307fall2018@gmail.com',
                subject: 'Password Reset E-Mail confirmation',
                text: 'Hello,\n\n' +
                      'This is a confirmation that the password for your account ' + 
                       user.email + 
                       ' has just been changed.\n'
            }
            smtpTransport.sendMail(mailOptions, function(err) {
                if (err) {
                    req.flash("error", err.message);
                    res.redirect("back");
                }
                req.flash("success", "Your password has been Updated");
                done(err);
            });
        }
    ], function(err) {
        req.flash("error", err.message);
        res.redirect('/');
    });
});


//logout router
userRouter.get('/logout', function(req, res, next) {
    req.flash("success", "Log you out successfully!");
    req.logout();
    res.redirect('/');
});

module.exports = userRouter;