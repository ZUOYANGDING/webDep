var mongoose = require('mongoose');
var Schema = mongoose.Schema;

commentSchema = new Schema ({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        username: {
            type: String
        }
    },
    text: {
        type: String,
        required: true
    },
    timeCreate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("comments", commentSchema);