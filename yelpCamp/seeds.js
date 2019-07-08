var mongoose = require('mongoose');
var Campgrounds = require('./models/campground');
var Comments = require('./models/comment');

var seedData = [
    {
        name: "William B Umstead State Park Campground",
        image: "https://www.campsitephotos.com/photo/camp/33363/William_B_Umstead_001.jpg",
        description: "Tucked between the growing cities of Raleigh, Cary, Durham and the corporate world of Research Triangle Park is an oasis of tranquility, a peaceful haven—William B. Umstead State Park.Here, two worlds merge as the sounds of civilization give way to the unhurried rhythm of nature. Highways fade in the distance as trees, flowers, birds and streams form a more natural community. William B. Umstead is a place to escape the pressures of everyday life, a place to picnic in the pines, to wait for a fish to bite, to take a hike or horseback ride on trails through the woods.Divided into two sections, Crabtree Creek and Reedy Creek, this 5,579-acre park is easily accessible from Interstate 40 and US 70. Visit William B. Umstead State Park and enjoy this region of wilderness at the city’s doorstep."
    },
    {
        name: "Plaskett Creek Campground",
        image: "https://www.campsitephotos.com/photo/camp/19882/Plaskett_Creek_031.jpg",
        description: "Plaskett Creek Campground is located in Big Sur and has 44 campsites in a beautiful park-like setting among many mature Monterey pine and Cypress trees which offer nice shade. Campsites can accommodate tents, trailers and RVs (from 35 to 50 feet). Group camping is also available. Each campsite also has a paved parking pad, table, fire ring and pedestal BBQ.The campground has drinking water and flush toilets, but there are no hookups or dump station. There are also hiking trails from the Sand Dollar Day Use area to the beach. The day use are is about a 1/2 mile  drive from the campground."
    },
    {
        name: "Trough Creek State Park Campground",
        image: "https://www.campsitephotos.com/photo/camp/110189/Trough_Creek_State_Park_017.jpg",
        description: "Trough Creek State Park campground has 29 campsites. Most are large, level and with nice space between sites. Each campsite has a table, fire ring and grill.  The campground is located in a scenic gorge with views of mountains and easy access to some nice hiking trails. Outdoor recreation includes hiking, biking, winter sports (cross-country skiing), camping, picnicking and wildlife viewing."  
    }
]

function seedDB() {
    Campgrounds.remove({}).then(function() {
        console.log("removed all campgrounds");
        Comments.remove({}).then(function() {
            console.log("removed all comments");
            seedData.forEach(function(seed) {
                Campgrounds.create(seed).then((campground) => {
                    var campgroundCreate = "Campground with id: " + campground._id + " created";
                    console.log(campgroundCreate);
                    Comments.create({
                        author: "FADE",
                        text: "it is a good place"
                    }).then((comment) => {
                        campground.comments.push(comment);
                        campground.save().then((campground) => {
                            console.log("comment add success");
                        }).catch((err) => {
                            console.log("comment add failed")
                        });
                    }).catch((err) => {
                        console.log("comment create failed")
                    })
                }).catch((err) => {
                    console.log("campground create failed");
                })
            })
        }).catch((err) => {
            console.log(err);
        });       
    }).catch((err) => {
        console.log(err);
    });
}

module.exports = seedDB;