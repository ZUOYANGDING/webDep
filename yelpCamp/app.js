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



var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedParser);

app.set('port', (process.env.PORT || 3000));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

var connect = mongoose.connect("mongodb://localhost:27017/yelpcamp", {useNewUrlParser: true });
connect.then(() => {
    console.log("connect to local mongoDB");
}).catch((err) => {
    console.log(err);
});

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
    next();
});

// init DB
seedDB();

// routers for campgrounds
app.get('/', function(req, res, next) {
    res.render("landing");
}); 

app.get('/campgrounds', function(req, res, next) {
    Campgrounds.find({}).then((campgrounds) => {
        res.render("campgrounds/index", {campgrounds:campgrounds});
    }).catch((err) => {
        console.log(err);
    });
});

app.post('/campgrounds', isLogin, function(req, res, next) {
    Campgrounds.create(req.body).then((campground) => {
        res.statusCode = 200;
        res.redirect('/campgrounds');
    }).catch((err) => {
        console.log(err);
    });
});

app.get('/campgrounds/new', isLogin, function(req, res, next) {
    res.render("campgrounds/new");
});

app.get('/campgrounds/:id', function(req, res, next) {
    Campgrounds.findById(req.params.id).populate("comments").then(function(campground) {
        res.render("campgrounds/show", {campground: campground});
    }).catch((err) => {
        console.log(err);
    });
});

// routers for comments
app.get('/campgrounds/:id/comments/new', isLogin, function(req, res, next) {
    Campgrounds.findById(req.params.id).then((campground) => {
        if (campground) {
            res.render("comments/new", {campground: campground});
        }
    }).catch((err) => {
        console.log(err);
    })
});

app.post('/campgrounds/:id/comments', isLogin, function(req, res, next) {
    Comment.create(req.body.comment).then((comment) => {
        Campgrounds.findById(req.params.id).then((campground) => {
            if (campground) {
                campground.comments.push(comment);
                campground.save().then((campground) => {
                    console.log("add comment success");
                }).catch((err) => {
                    console.log(err);
                });
            }
        }).catch((err) => {
            console.log(err);
        });
        res.statusCode = 200;
        var redirectUrl = "/campgrounds/" + req.params.id;
        res.redirect(redirectUrl);
    }).catch((err) => {
        console.log(err);
    })
});


// register router
app.get('/register', function(req, res, next) {
    res.render('register');
});

app.post('/register', function(req, res, next) {
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
app.get('/login', function(req, res, next) {
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
    }), function(req, res, next) { 
});

//logout router
app.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});


//funciton for auth check
function isLogin(req, res, next){
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}


app.listen(app.get('port'), function() {
    console.log("get connection to server!");
});