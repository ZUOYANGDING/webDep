var mongoose = require('mongoose');
var localStratgeMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String
    },
    password: {
        type: String   
    }
});

userSchema.plugin(localStratgeMongoose);

module.exports = mongoose.model('users', userSchema);
