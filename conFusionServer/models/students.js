const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var studentSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    personalID: {
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
    averageGPA: {
        type: Number,
        min: 0,
        max: 4.00,
        required: true
    },
},{
        timestamps: true
});

var Students = mongoose.model("students", studentSchema);
module.exports = Students;