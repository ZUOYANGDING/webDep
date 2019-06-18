var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');
var userRouter = express.Router();
var passport = require('passport');
var authenticate = require('../authentication');

userRouter.use(bodyParser.json());

/* GET users listing. */
userRouter.get('/', authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  User.find({}).then((users) => {
    res.statusCode = 200;
    res.setHeader('Context-Type', 'application/json');
    res.json(users);
  }, (err) => {
    next(err);
  }).catch((err) => {
    next(err);
  })
});

// for session
// userRouter.post('/signUp', (req, res, next) => {
//   User.findOne({username: req.body.username}).then((user) => {
//     if (user != null) {
//       err = new Error("User " + req.body.username + " has already exist!");
//       err.status = 403;
//       return next(err);
//     } else {
//       return User.create({
//         username: req.body.username,
//         password: req.body.password
//       })
//     }
//   }, (err) => {
//     next(err);
//   }).then((user) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     res.json({status: "Registration successful!", user: user});
//   }, (err) => {
//     next(err);
//   }).catch((err) => {
//     next(err);
//   });
// });

// apply passport
userRouter.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    } else {
      if (req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      if (req.body.lastname) {
        user.lastname = req.body.lastname;
      }
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
        } else {
          passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: "Registration successful!"});
        });
      }});
    }
  });
});

//  for session
// userRouter.post('/login', (req, res, next) => {
//   if (!req.session.user) {
//     var authHeader = req.headers.authorization;
//     if (!authHeader) {
//       err = new Error("Have not been authorized!");
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 401;
//       return next(err);
//     }
    
//     var auth = new Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");
//     var username = auth[0];
//     var password = auth[1];

//     User.findOne({username: username}).then((user) => {
//       if (!user) {
//         err = new Error("User " + username + " does not exist!");
//         err.status = 403;
//         return next(err);
//       } else if (user.password !== password) {
//         err = new Error("Password is incorrect!");
//         err.status = 403;
//         return next(err)
//       } else if (user.username===username && user.password===password) {
//         req.session.user = "authenticated";
//         res.setHeader('Content-Type', 'text/plain');
//         res.end("login sucessful");
//       }
//     }, (err) => {
//       next(err);
//     }).catch((err) => {
//       next(err);
//     });
//   } else {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end("You have already login");
//   }
// });


// apply passport
userRouter.post('/login', passport.authenticate('local'), (req, res, next) => {
  // apply token
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: "Login successful!"});
});

userRouter.get('/logOut', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect('/');
  } else {
    err = new Error("You have not login yet!");
    err.status = 403;
    return next(err);
  }
});

module.exports = userRouter;
