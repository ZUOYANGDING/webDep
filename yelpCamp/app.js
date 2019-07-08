var express     =   require('express');
var bodyParser  =   require('body-parser');
var mongoose    =   require('mongoose');
var Campgrounds =   require('./models/campground');
var seedDB      =   require('./seeds');
var Comment     =   require('./models/comment');


var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedParser);

app.set('port', (process.env.PORT || 3000));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

var connect = mongoose.connect("mongodb://localhost:27017/yelpcamp");
connect.then(() => {
    console.log("connect to local mongoDB");
}).catch((err) => {
    console.log(err);
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

app.post('/campgrounds', function(req, res, next) {
    Campgrounds.create(req.body).then((campground) => {
        res.statusCode = 200;
        res.redirect('/campgrounds');
    }).catch((err) => {
        console.log(err);
    });
});

app.get('/campgrounds/new', function(req, res, next) {
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
app.get('/campgrounds/:id/comments/new', function(req, res, next) {
    Campgrounds.findById(req.params.id).then((campground) => {
        if (campground) {
            res.render("comments/new", {campground: campground});
        }
    }).catch((err) => {
        console.log(err);
    })
});

app.post('/campgrounds/:id/comments', function(req, res, next) {
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






app.listen(app.get('port'), function() {
    console.log("get connection to server!");
});