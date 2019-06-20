var passport = require('passport');
var localStrategy= require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var User = require('./models/user');
var config = require('./config');
var FacebookTokenStrategy = require('passport-facebook-token');

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//apply token
exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
}

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;
exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("JWT payload: ", jwt_payload);
    User.findOne({_id: jwt_payload._id}, (err, user) => {
        if (err) {
            return done(err, false);
        } else if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));


exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next) => {
    User.findById(req.user._id).then((user) => {
        if (user.admin) {
            next();
        } else {
            err = new Error('You are not authorized to perform this operation!');
            err.status = 403;
            return next(err);
        }
    }).catch((err) => {
        next(err);
    });
}

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({facebookId: profile.id}, (err, user) => {
        if (err) {
            return done(err, false);
        } else if (!err && user!==null) {
            return done(null, user);
        } else {
            user = new User({username: profile.displayName});
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save().then((user) => {
                if (!user) {
                    return done(null, false);
                } else {
                    return done(null, user);
                }
            }).catch((err) => {
                return done(err, false);
            });
        }
    });
}));