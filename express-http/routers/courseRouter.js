const express = require('express');
const bodyParser = require('body-parser');

const courseRouter = express.Router();
courseRouter.use(bodyParser.json());

courseRouter.route('/').all((_req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
}).get((_req, res, _next) => {
    res.end("Will show all courses!");
}).post((req, res, _next) => {
    res.end("Will add the course: " + req.body.name + ": " + req.body.description);
}).put((_req, res, _next) => {
    res.statusCode = 403;
    res.end("Update operation does not support at /courses!");
}).delete((_req, res, _next) => {
    res.end("Will delete all courses!");
});

courseRouter.route('/:courseID').all((_req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
}).get((req, res, _next) => {
    res.end("Will send detail about course: " + req.body.name + " with courseID: " + req.params.courseID);
}).post((req, res, _next) => {
    res.statusCode = 403;
    res.end("Add operation does not suppport at /course/" + req.params.courseID);
}).put((req, res, _next) => {
    res.write("Update the course: " + req.body.name + "'s ID to " + req.params.courseID + "\n");
    res.end("Updated the course: " + req.body.name + " with course ID: " + req.params.courseID);
}).delete((req, res, _next) => {
    res.end("Delete the course: " + req.body.name + " with course ID: " + req.params.courseID);
});

module.exports = courseRouter;

