var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var courseRouter = require('./routes/courseRouter');
var studentRouter = require('./routes/studentRouter');
var professorRouter = require('./routes/professorRouter');
var authenticate = require('./authentication');

var app = express();
var url = 'mongodb://localhost:27017/conFusion'
var connect = mongoose.connect(url);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('1234-5678-9098-7654-3210'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: 'session-id',
  secret: '1234-5678-9098-7654-3210',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

// apply passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// for session
// function auth(req, res, next) {
//   console.log(req.session);
//   if (!req.session.user){
//     err = new Error("Have not been authorized!");
//     res.setHeader('WWW-Authenticate', 'Basic');
//     err.status = 401;
//     return next(err);
//   } else {
//     if (req.session.user === "authenticated") {
//       console.log("req.session: ", req.session);
//       return next();
//     } else {
//       err = new Error("Have not been authorized!");
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 401;
//       return next(err);
//     }
//   }
// }

function auth(req, res, next) {
  if (!req.user) {
    err = new Error("Have not been authorized!");
    err.status = 403;
    next(err);
  } else {
    next();
  }
}

app.use(auth);

app.use('/courses', courseRouter);
app.use('/teachers', professorRouter);
app.use('/students', studentRouter);

connect.then(() => {
  console.log("connected to mongo server");
}).then((err) => {
  console.log(err);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
