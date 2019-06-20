const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Courses = require('../models/courses');
var authenticate = require('../authentication');
var cors = require('./cors');
const courseRouter = express.Router();
courseRouter.use(bodyParser.json());

//for all courses
courseRouter.route('/').options(cors.corsWithOption, (req, res) =>{
    res.sendStatus(200);
}).get(cors.cors, (req, res, next) => {
    Courses.find({}).populate('comments.author').then((courses) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(courses);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).post(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Courses.create(req.body).then((course) => {
        console.log("Course created");
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(course);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (_req, res, _next) => {
    res.statusCode = 403;
    res.end("Update operation does not support at /courses!");
}).delete(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (_req, res, next) => {
    Courses.deleteMany({}).then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
});

courseRouter.route('/:courseID').options(cors.corsWithOption, (req, res) =>{
    res.sendStatus(200);
}).get(cors.cors, (req, res, next) => {
    Courses.findById(req.params.courseID).populate('comments.author').then((course) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(course);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).post(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, _next) => {
    res.statusCode = 403;
    res.end("Add operation does not suppport at /course/" + req.params.courseID);
}).put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Courses.findByIdAndUpdate((req.params.courseID), {
        $set: req.body
    }, {
        new: true
    }).then((course) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(course);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    })
}).delete(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Courses.findByIdAndRemove((req.params.courseID)).then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    })
});


//for comments
courseRouter.route('/:courseID/comments').options(cors.corsWithOption, (req, res) =>{
    res.sendStatus(200);
}).get(cors.cors, (req, res, next) => {
    Courses.findById(req.params.courseID).populate('comments.author').then((course) => {
        if (course != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(course.comments);
        } else {
            err = new Error("course " + req.params.courseID + " cannot be found!");
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).post(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Courses.findByIdAndUpdate(req.params.courseID).then((course) => {
        if (course != null) {
            req.body.author = req.user;
            course.comments.push(req.body);
            course.save().then((course) => {
                Courses.findById(course._id).populate('comments.author').then((course) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(course);
                }, (err) => {
                    next(err);
                }).catch((err) => {
                    next(err);
                });
            }, (err) => {
                next(err);
            }).catch((err) => {
                next(err);
            });
        } else {
            err = new Error("course" + req.params.courseID + " cannot be found!");
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).put(cors.corsWithOption, authenticate.verifyUser, (_req, res, _next) => {
    res.statusCode = 403;
    res.end("Update operation does not support at /:courseID/comments!");
}).delete(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Courses.findByIdAndUpdate(req.params.courseID).then((course) => {
        if (course != null) {
            for (var i=course.comments.length-1; i>=0; i--) {
                course.comments.id(course.comments[i]._id).remove();
            }
            course.save().then((course) => {     
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(course);
            }, (err) => {
                next(err);
            })
        } else {
            err = new Error("course" + req.params.courseID + " cannot be found!");
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
});

courseRouter.route('/:courseID/comments/:commentID').options(cors.corsWithOption, (req, res) =>{
    res.sendStatus(200);
}).get(cors.cors, (req, res, next) => {
    Courses.findById(req.params.courseID).populate('comments.author').then((course) => {
        if (course != null && course.comments.id(req.params.commentID) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(course.comments.id(req.params.commentID));
        } else if(course == null) {
            err = new Error("course" + req.params.courseID + " cannot be found!");
            err.status = 404;
            return next(err);
        } else {
            err = new Error("comment " + req.params.commentID + " cannot be found!");
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).post(cors.corsWithOption, authenticate.verifyUser, (req, res, _next) => {
    res.statusCode = 403;
    res.end("Add operation does not suppport at /course/" + req.params.courseID + 
    "/comments/" + req.params.commentID);
}).put(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Courses.findByIdAndUpdate(req.params.courseID).then((course) => {
        if (course != null && course.comments.id(req.params.commentID) != null) {
            if ((course.comments.id(req.params.commentID).author).equals(req.user._id)) {
                if (req.body.rate) {
                    course.comments.id(req.params.commentID).rate = req.body.rate;
                }
                if (req.body.comment) {
                    course.comments.id(req.params.commentID).comment = req.body.comment;
                } 
                if (req.body.rate == null && req.body.comment == null){
                    err = new Error("Update request is not supported!");
                    err.status = 403;
                    return next(err);
                }
                course.save().then((course) => {
                    Courses.findById(course._id).populate('comments.author').then((course) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(course);
                    }, (err) => {
                        next(err);
                    }).catch((err) => {
                        next(err);
                    });
                }, (err) => {
                    next(err);
                }).catch((err) => {
                    next(err);
                })
            } else {
                err = new Error("You cannot edit other people's comments");
                err.status = 403;
                return next(err);
            }
        } else if(course == null) {
            err = new Error("course" + req.params.courseID + " cannot be found!");
            err.status = 404;
            return next(err);
        } else {
            err = new Error("comment " + req.params.commentID + " cannot be found!");
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).delete(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Courses.findById(req.params.courseID).then((course) => {
        if (course != null && course.comments.id(req.params.commentID) != null) {
            if ((course.comments.id(req.params.commentID).author).equals(req.user._id)) {
                course.comments.id(req.params.commentID).remove();
                course.save().then((course) => {
                    Courses.findById(course._id).populate('comment.author').then((course) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(course);
                    }, (err) => {
                        next(err);
                    }).catch((err) => {
                        next(err);
                    });
                }, (err) => {
                    next(err);
                }).catch((err) => {
                    next(err);
                })
            } else {
                err = new Error("You cannot delete other people's comments!");
                err.status = 403;
                return next(err);
            }
        } else if(course == null) {
            err = new Error("course" + req.params.courseID + " cannot be found!");
            err.status = 404;
            return next(err);
        } else {
            err = new Error("comment " + req.params.commentID + " cannot be found!");
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
});

module.exports = courseRouter;

