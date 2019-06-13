const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    rate: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

var courseSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    major: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ""
    },
    price: {
        type: Currency,
        min: 0,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]
},{
        timestamps: true
});

var Courses = mongoose.model("courses", courseSchema);
module.exports = Courses;