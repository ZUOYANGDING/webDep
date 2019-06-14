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

var professorSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    researchField: {
        type: String,
        required: true
    },
    income: {
        type: Currency,
        min: 0,
        required: true
    },
    comments: [commentSchema]
},{
        timestamps: true
});

var Professors = mongoose.model("professors", professorSchema);
module.exports = Professors;