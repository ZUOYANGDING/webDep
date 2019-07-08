var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campgrounds = require('./models/campground');
var seedDB = require('./seeds');

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedParser);

app.set('port', (process.env.PORT || 3000));
app.set('view engine', 'ejs');

var connect = mongoose.connect("mongodb://localhost:27017/yelpcamp");
connect.then(() => {
    console.log("connect to local mongoDB");
}).catch((err) => {
    console.log(err);
});

seedDB();

app.get('/', function(req, res, next) {
    res.render("landing");
}); 

app.get('/campgrounds', function(req, res, next) {
    Campgrounds.find({}).then((campgrounds) => {
        res.render("index", {campgrounds:campgrounds});
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
    res.render("new");
});

app.get('/campgrounds/:id', function(req, res, next) {
    Campgrounds.findById(req.params.id).then((campground) => {
        res.render("show", {campground: campground});
    }).catch((err) => {
        console.log(err);
    });
});


app.listen(app.get('port'), function() {
    console.log("get connection to server!");
});