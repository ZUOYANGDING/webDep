const express = require('express');
const bodyParse = require('body-parser');

const studentRouter = express.Router();

studentRouter.use(bodyParse.json());

studentRouter.route('/').all((_req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
}).get((_req, res, _next) => {
    res.end("Povide information about all students!");
}).post((req, res, _next) => {
    res.end("Add student: " + req.body.name + " with description " + req.body.description);
}).put((_req, res, _next) => {
    res.statusCode = 403;
    res.end("Update operation does not suppport at /students!");
}).delete((_req, res, _next) => {
    res.end("delete all students' informaiton!");
});

studentRouter.route('/:studentID').all((_req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
}).get((req, res, _next) => {
    res.end("Provide informaitona about student: " + req.body.name + " with ID " + 
    req.params.studentID + " with description: " + req.body.description);
}).post((_req, res, _next) => {
    res.statusCode = 403;
    res.end("Add operation does not support at /students/:studentID");
}).put((req, res, _next) => {
    res.write("Student: " + req.body.name + " with ID " + req.params.studentID + 
    " will be updated to " + req.params.studentID + "\n");
    res.end("Student: " + req.body.name + "'s ID has been updated");
}).delete((req, res, _next) => {
    res.end("Student: " + req.body.name + " with ID " + req.params.studentID + " has been deleted!");
});

module.exports = studentRouter;