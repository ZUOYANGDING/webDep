var mongoose = require('mongoose');
var localStratgeMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    // changed
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String   
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    avatar: {
        type: String
    },
    // changed
    email: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String
    },
    resetPasswordToken : {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
});

userSchema.plugin(localStratgeMongoose);

module.exports = mongoose.model('users', userSchema);
