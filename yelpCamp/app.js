var express = require('express');


var app = express();

app.set('port', (process.env.PORT || 3000));
app.set('view engine', 'ejs');
app.get("/", function(req, res, next) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res, next) {
    var campgrounds = [
        {name: "Liza Bovec", image: "https://www.campsitephotos.com/photo/camp/53332/feature_Forks-f3.jpg"},
        {name: "paperbark", image: "https://www.campsitephotos.com/photo/camp/53059/feature_Sage_Flat-f3.jpg"},
        {name: "Snowberry", image: "https://www.campsitephotos.com/photo/camp/108155/feature_Snowberry-f4.jpg"}
    ];
    res.render("campgrounds", {campgrounds});
});

app.listen(app.get('port'), function() {
    console.log("get connection to server!");
});