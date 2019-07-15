var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var campgroundSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author :{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        username: {
            type: String
        }
    },
    price: {
        type: String
    },
    location: {
        name: {
            type: String
        },
        lat: {
            type: Number
        },
        lgn: {
            type: Number
        }
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    }]
});

var Campgrounds = mongoose.model("campgrounds", campgroundSchema);
module.exports = Campgrounds;