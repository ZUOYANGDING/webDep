const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const Professors = require('../models/professors');
var authenticate = require('../authentication');
var cors = require('./cors');

const professorRouter = express.Router();
professorRouter.use(bodyParser.json());

//for professors
professorRouter.route('/').options(cors.corsWithOption, (req, res) => {
    res.sendStatus(200);
}).get(cors.cors, (req, res, next) => {
    Professors.find({}).populate('comments.author').then((professors) => {
       res.statusCode = 200;
       res.setHeader('Content-Type', 'application/json');
       res.json(professors); 
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).post(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Professors.create(req.body).then((professor) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(professor);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    })
}).put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (_req, res, _next) => {
    res.statusCode = 403;
    res.end("Update operation does not support at /teachers!");
}).delete(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (_req, res, next) => {
    Professors.deleteMany({}).then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    })
});

professorRouter.route('/:teacherID').options(cors.corsWithOption, (req, res) => {
    res.sendStatus(200);
}).get(cors.cors, (req, res, next) => {
    Professors.findById(req.params.teacherID).populate('comments.author').then((professor) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(professor);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    })
}).post(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (_req, res, _next) => {
    res.statusCode = 403;
    res.end("Add operation does not support at /teachers/teacherID");
}).put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Professors.findByIdAndUpdate((req.params.teacherID), {
        $set: req.body
    }, {
        new: true
    }).then((professor) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(professor);
    }, (err) => {
        next(err);
    }).catch((err) =>{
        next(err);
    });
}).delete(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Professors.findByIdAndRemove(req.params.teacherID).then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    })
});


//for professors' comments
professorRouter.route('/:teacherID/comments').options(cors.corsWithOption, (req, res) => {
    res.sendStatus(200);
}).get(cors.cors, (req, res, next) => {
    Professors.findById(req.params.teacherID).populate('comments.author').then((professor) => {
        if (professor != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(professor.comments);
        } else {
            err = new Error("professor " + req.params.teacherID + " cannot be found!");
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).post(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Professors.findByIdAndUpdate(req.params.teacherID).then((professor) => {
        if (professor != null) {
            req.body.author = req.user;
            professor.comments.push(req.body);
            professor.save().then((professor) => {
                Professors.findById(professor._id).populate('comments.author').then((professor) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(professor);
                }, (err) => {
                    next(err);
                }).catch((err) => {
                    next(err);
                })
            }, (err) => {
                next(err);
            }).catch((err) => {
                next(err);
            });
        } else {
            err = new Error("professor " + req.params.teacherID + " cannot be found!");
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).put(cors.corsWithOption, authenticate.verifyUser, (req, res, _next) => {
    res.statusCode = 403;
    res.end("Update operation does not support at /" + req.params.teacherID + "/comments");
}).delete(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Professors.findByIdAndUpdate(req.params.teacherID).then((professor) => {
        if (professor != null) {
            for (var i=professor.comments.length-1; i>=0; i--) {
                professor.comments.id(professor.comments[i]._id).remove();
            }
            professor.save().then((professor) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(professor);
            }, (err) => {
                next(err);
            })
        } else {
            err = new Error("professor " + req.params.teacherID + " cannot be found!");
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    })
});

professorRouter.route('/:teacherID/comments/:commentID').options(cors.corsWithOption, (req, res) => {
    res.sendStatus(200);
}).get(cors.cors, (req, res, next) => {
    Professors.findById(req.params.teacherID).populate('comments.author').then((professor) =>{
        if (professor != null && professor.comments.id(req.params.commentID) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(professor.comments.id(req.params.commentID));
        } else if (professor == null) {
            err = new Error("professor " + req.params.teacherID + " cannot be found!");
            err.status = 404;
            return next(err);
        } else {
            err = new Error("comment" + req.params.commentID + " cannot be found!");
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    })
}).post(cors.corsWithOption, authenticate.verifyUser, (req, res, _next) => {
    res.statusCode = 403;
    res.end("Add operation does not support at /" + req.params.teacherID + "/comments/" + req.params.commentID);
}).put(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Professors.findByIdAndUpdate(req.params.teacherID).then((professor) => {
        if (professor != null && professor.comments.id(req.params.commentID) != null) {
            if ((professor.comments.id(req.params.commentID).author).equals(req.user._id)) {
                if (req.body.rate) {
                    professor.comments.id(req.params.commentID).rate = req.body.rate;
                }
                if (req.body.comment) {
                    professor.comments.id(req.params.commentID).comment = req.body.comment;
                }
                if (req.body.rate == null && req.body.comment == null) {
                    err = new Error("Update request is not supported!");
                    err.status = 403;
                    return next(err);
                }
                professor.save().then((professor) => {
                    Professors.findById(professor._id).populate('comments.author').then((professor) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(professor);
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
                err = new Error("You cannot edit other people's comments");
                err.status = 403;
                return next(err);
            }
        } else if (professor == null) {
            err = new Error("professor " + req.params.teacherID + " cannot be found!");
            err.status = 404;
            return next(err);
        } else {
            err = new Error("comment" + req.params.commentID + " cannot be found!");
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    }).catch((err) =>{
        next(err);
    });
}).delete(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Professors.findByIdAndUpdate(req.params.teacherID).then((professor) => {
        if (professor != null && professor.comments.id(req.params.commentID) != null) {
            if ((professor.comments.id(req.params.commentID).author).equals(req.user._id)) {
                professor.comments.id(req.params.commentID).remove();
                professor.save().then((professor) => {
                    Professors.findById(professor._id).populate('comments.author').then((professor) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(professor);
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
                err = new Error("You cannot edit other people's comments");
                err.status = 403;
                return next(err);
            }
        } else if (professor == null) {
            err = new Error("professor " + req.params.teacherID + " cannot be found!");
            err.status = 404;
            return next(err);
        } else {
            err = new Error("comment" + req.params.commentID + " cannot be found!");
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    })
});
module.exports = professorRouter;
