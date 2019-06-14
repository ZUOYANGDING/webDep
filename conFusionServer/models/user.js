const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var useSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});

var User = mongoose.model("users", useSchema);
module.exports = User;