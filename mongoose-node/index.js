const mongoose = require('mongoose');
const Courses = require('./models/courses');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then(() => {
    console.log("Sever connected");

    Courses.create({
        name: "CS240",
        description: "Intro to C programming"
    }).then((course) => {
        console.log("Saved a new course", course);
        return Courses.findByIdAndUpdate(course._id, {
            $set: {
                description: 'Update the description'
            }
        },{
            // return the updated course
            new: true
        });
    }).then((course) => {
        console.log("Finish update description ");
        course.comments.push({
            rate: 5,
            comment: "perfect intro to C language",
            author: "a student"
        });
        return course.save();
    }).then((course) =>{
        console.log("Found the course", course);
        return Courses.deleteMany({});
    }).then((result) => {
        console.log("Romoved the course", result);
        return mongoose.connection.close();
    }).catch((err) => {
        console.log(err);
    });
}).then((err) => {
    console.log(err);
});