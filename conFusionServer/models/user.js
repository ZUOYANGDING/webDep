const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// var useSchema = new Schema({
//     username: {
//         type: String,
//         unique: true,
//         required: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     admin: {
//         type: Boolean,
//         default: false
//     }
// });

var useSchema = new Schema({
    admin: {
        type: Boolean,
        default: false
    }
});

useSchema.plugin(passportLocalMongoose);

var User = mongoose.model("users", useSchema);
module.exports = User;