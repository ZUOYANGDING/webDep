const express = require('express');
const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const Students = require("../models/students");
const studentRouter = express.Router();
studentRouter.use(bodyParse.json());

studentRouter.route('/').get((req, res, next) => {
    Students.find({}).then((students) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(students);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).post((req, res, next) => {
    Students.create(req.body).then((student) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(student);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).put((req, res, next) => {
    res.statusCode = 403;
    res.end("Update operation does not suppport at /students!");
}).delete((req, res, next) => {
    Students.deleteMany({}).then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(result);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
});

studentRouter.route('/:studentID').get((req, res, next) => {
    Students.findById(req.params.studentID).then((student) => {
        if (student != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(student);
        } else {
            err = new Error('Student ' + req.params.studentID + " cannot be found!");
            err.status = 404;
            return next(err);
        }
    }, (err) => { 
        next(err);
    }).catch((err) => {
        next(err);
    });
}).post((_req, res, _next) => {
    res.statusCode = 403;
    res.end("Add operation does not support at /students/:studentID");
}).put((req, res, next) => {
    Students.findByIdAndUpdate((req.params.studentID), {
        $set: req.body
    }, {
        new: true
    }).then((student) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'applicaiton/json');
        res.json(student);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).delete((req, res, next) => {
    Students.findByIdAndRemove(req.params.studentID).then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'applicaiton/json');
        res.json(result);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
});
module.exports = studentRouter;