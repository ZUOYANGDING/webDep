var mongoose = require('mongoose');
var Schema = mongoose.Schema;

commentSchema = new Schema ({
    author: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("comments", commentSchema);