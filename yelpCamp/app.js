require('dotenv').config();

var express         =   require('express');
var bodyParser      =   require('body-parser');
var mongoose        =   require('mongoose');
var Campgrounds     =   require('./models/campground');
var seedDB          =   require('./seeds');
var Comment         =   require('./models/comment');
var passport        =   require('passport');
var passportLocal   =   require('passport-local');
var User            =   require('./models/user');
var session         =   require('express-session');
var methodOverride  =   require('method-override');
var flash           =   require('connect-flash'); 

var campgroundRouter    =   require('./routers/campgroundRouter');
var commentRouter       =   require('./routers/commentRouter');
var userRouter          =   require('./routers/userRouter');


var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedParser);

app.set('port', (process.env.PORT || 3000));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

// method override for update and delete req
app.use(methodOverride('_method'));

var connect = mongoose.connect("mongodb://localhost:27017/yelpcamp", {useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
connect.then(() => {
    console.log("connect to local mongoDB");
}).catch((err) => {
    console.log(err);
});

// use flash message
app.use(flash());

//apply auth by passport
app.use(session({
    secret: "1234567890987654321",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// get current user signed in
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// init DB
seedDB();


// set routers
app.get('/', function(req, res, next) {
    res.render("landing");
});
app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/comments', commentRouter);
app.use('/', userRouter);


app.listen(app.get('port'), function() {
    console.log("get connection to server!");
});