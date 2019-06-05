const http = require('http');
const express = require('express');
const morgen = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const hostname = 'localhost'

app.use(morgen('dev'));
app.use(bodyParser.json());

app.all('/courses', (_req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
});

app.get('/courses', (_req, res, _next) => {
    res.end("Will show all courses!");
});

app.post('/courses', (req, res, _next) => {
    res.end("Will add the course: " + req.body.name + ": " + req.body.description);
});

app.put('/courses', (_req, res, _next) => {
    res.statusCode = 403;
    res.end("Update operation does not support at /courses!");
});

app.delete('/courses', (_req, res, _next) => {
    res.end("Will delete all courses!");
});

app.get('/courses/:courseID', (req, res, _next) => {
    res.end("Will send detail about course: " + req.body.name + " with courseID: " + req.params.courseID);
});

app.post('/courses/:courseID', (req, res, _next) => {
    res.statusCode = 403;
    res.end("Add operation does not suppport at /course/" + req.params.courseID);
});

app.put('/courses/:courseID', (req, res, _next) => {
    res.write("Update the course: " + req.body.name + "'s ID to " + req.params.courseID + "\n");
    res.end("Updated the course: " + req.body.name + " with course ID: " + req.params.courseID);
});

app.delete('/courses/:courseID', (req, res, _next) => {
    res.end("Delete the course: " + req.body.name + " with course ID: " + req.params.courseID);
});




app.use(express.static(__dirname + '/public'));
app.use((req, res, _next) => {
    // console.log("Request for " + req.url + " by method " + req.method);
    console.log(req.headers);
    res.statusCode = 200;
    res.setHeader('content-Type', 'text/html');
    res.end('<html><body><h1>this is the express server</h1></body></html>');
});

const server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log(`Server is running at: http:\\${hostname}:${port}/`);
});