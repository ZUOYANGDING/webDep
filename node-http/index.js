const http = require('http');
const fs = require('fs');
const path = require('path');
const hostname = 'local host';
const port = '3000';

const server = http.createServer((req, res) => {
    var reqUrl = req.url;
    var reqMethod = req.method;
    console.log("Request for " + reqUrl + " by method " + reqMethod);
    
    if (reqMethod == 'GET'){
        var fileUrl;
        if (reqUrl == '/') {
            fileUrl = '/index.html';
        } else {
            fileUrl = reqUrl;
        }

        var filePath = path.resolve('./public' + fileUrl);
        var fileExtend = path.extname(filePath);
        if (fileExtend == '.html'){
            fs.exists(filePath, (exists) => {
                if (exists) {
                    res.statusCode = 200;
                    res.setHeader('content-type', 'text/html');
                    fs.createReadStream(filePath).pipe(res);
                } else {
                    res.statusCode = 404;
                    res.setHeader('content-type', 'text/html');
                    res.end('<html><body><h1>ERROR: 404 '+ fileUrl + ' not found</h1></body></html>');
                }
            });
        } else {
            res.statusCode = 404;
            res.setHeader('content-type', 'text/html');
            res.end('<html><body><h1>ERROR: 404 '+ fileUrl + ' not a HTML file</h1></body></html>');
        }
    } else {
        res.statusCode = 404;
        res.setHeader('content-type', 'text/html');
        res.end('<html><body><h1>ERROR: 404 '+ req.method + ' does not support</h1></body></html>');
    }

    // res.statusCode = 200;
    // res.setHeader('content-type', 'text/html');
    // res.end('<html><body><h1>Hello, World!</h1></body></html>');
});

server.listen(port, () => {
   console.log(`Server is running at http:\\${hostname}:${port}/`); 
});