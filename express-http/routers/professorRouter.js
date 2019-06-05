const express = require('express');
const bodyParser = require('body-parser');
const professorRouter = express.Router();

professorRouter.use(bodyParser.json());

professorRouter.route('/').all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
}).get((_req, res, _next) => {
    res.end("Will provide all teachers' informaiton!");
}).post((req, res, _next) => {
    res.end("Will add teacher: " + req.body.name + " with description: " + req.body.description);
}).put((_req, res, _next) => {
    res.statusCode = 403;
    res.end("Update operation does not support at /teachers!");
}).delete((_req, res, _next) => {
    res.end("delete all teachers information!");
});

professorRouter.route('/:teacherID').all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
}).get((req, res, _next) => {
    res.end("Provide teacher: " + req.body.name + " with ID " + req.params.teacherID + " details: " + 
    req.body.description);
}).post((_req, res, _next) => {
    res.statusCode = 403;
    res.end("Add operation does not support at /teachers/teacherID");
}).put((req, res, _next) => {
    res.write("Update the teacher: " + req.body.name + " with teacher ID " + req.params.teacherID +
    " to " + req.params.teacherID + "\n");
    res.end("Updated teacher: " + req.body.name + "'s ID");
}).delete((req, res, _next) => {
    res.end("delete teacher: " + req.body.name + "'s ID");
});

module.exports = professorRouter;
