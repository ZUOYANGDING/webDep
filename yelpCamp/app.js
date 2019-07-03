var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedParser);

app.set('port', (process.env.PORT || 3000));
app.set('view engine', 'ejs');

var campgrounds = [
    {name: "Liza Bovec", image: "https://www.campsitephotos.com/photo/camp/53332/feature_Forks-f3.jpg"},
    {name: "paperbark", image: "https://www.campsitephotos.com/photo/camp/53059/feature_Sage_Flat-f3.jpg"},
    {name: "Snowberry", image: "https://www.campsitephotos.com/photo/camp/108155/feature_Snowberry-f4.jpg"}
];

app.get('/', function(req, res, next) {
    res.render("landing");
});

app.get('/campgrounds', function(req, res, next) {
    res.render("campgrounds", {campgrounds:campgrounds});
});

app.post('/campgrounds', function(req, res, next) {
    var name = req.body.name;
    var image = req.body.image;
    var campground = {name: name, image: image};
    campgrounds.push(campground);
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new', function(req, res, next) {
    res.render("new");
});

app.listen(app.get('port'), function() {
    console.log("get connection to server!");
});