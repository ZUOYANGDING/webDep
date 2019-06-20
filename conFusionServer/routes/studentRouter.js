const express = require('express');
const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const Students = require("../models/students");
var authenticate = require('../authentication');
var cors = require('./cors');
const studentRouter = express.Router();
studentRouter.use(bodyParse.json());

studentRouter.route('/').options(cors.corsWithOption, (req, res) => {
    res.sendStatus(200);
}).get(cors.cors, (req, res, next) => {
    Students.find({}).then((students) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(students);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).post(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Students.create(req.body).then((student) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(student);
    }, (err) => {
        next(err);
    }).catch((err) => {
        next(err);
    });
}).put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("Update operation does not suppport at /students!");
}).delete(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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

studentRouter.route('/:studentID').options(cors.corsWithOption, (req, res) => {
    res.sendStatus(200);
}).get(cors.cors, (req, res, next) => {
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
}).post(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (_req, res, _next) => {
    res.statusCode = 403;
    res.end("Add operation does not support at /students/:studentID");
}).put(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
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
}).delete(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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