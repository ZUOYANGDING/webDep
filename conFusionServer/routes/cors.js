var cors = require('cors');
var express = require('express');
var app = express()

var whiteList = ['http://localhost:3000', 'https://localhost:3443'];

var corsOptionDelegate = (req, callback) => {
    var corsOption;
    console.log(req.header('Origin'));
    if (whiteList.indexOf(req.header("Origin")) !== -1) {
        corsOption = {origin: true};
    } else {
        corsOption = {origin: false};
    }
    callback(null, corsOption);
}

exports.cors = cors();
exports.corsWithOption = cors(corsOptionDelegate);