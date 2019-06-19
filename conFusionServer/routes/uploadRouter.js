var express = require('express');
var bodyParser = require('body-parser');
var authenticate = require('../authentication');
var multer = require('multer');

var uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images');
    },

    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

var imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.{jpg|png|jepg|gif}$/)) {
        return callback(new Error("You can only upload image file!"), false);
    } else {
        callback(null, true);
    }
}

var upload = multer({storage: storage, fileFilter: imageFileFilter});

uploadRouter.route('/').get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("GET request is not support in /imageUpload!");
}).post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
}).put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT request is not support in /imageUpload!");
}).delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("DELETE request is not support in /imageUpload!");
});

module.exports = uploadRouter;