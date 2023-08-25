// this loads the core module http which means it is always available via require() in node
const http = require('http');
const querystring = require('querystring');
// core module that interacts with files system;
const fs = require('fs');

const port = process.env.PORT || 1337

function respondText(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Howdy');
}

function respondJson(req, res) {
    res.setHeader('Content-type', 'application/json');
    res.end(JSON.stringify({text: 'Howdy', numbers: [1,2,3]}));
}

function respondNotFound(req, res) {
    res.writeHeader(404, {'Content-Type': 'text/plain'})
    res.end('Not Found');
}

function respondEcho(req, res) {
    const { input = ''} = querystring.parse(req.url.split('?').slice(1).join(''));

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(
        {
            normal: input, 
            shouty: input.toUpperCase(), 
            characterCount: input.length, 
            backwards: input.split('').reverse().join('')
        }
    ));
}

function respondStatic(req, res) {
    const filename = `${__dirname}/public${req.url.split('/static')[1]}`;
    // this creates a stream object for our chosen file. the pipe() method connects this stream object to the response.
    // behind the scenes it is loading the data from filesystem and sends to the client on the response
    fs.createReadStream(filename)
        .on('error', () => respondNotFound(req, res))
        .pipe(res)
}

// request listener is called everytime there is a request to the server.
const server = http.createServer(function (req, res) {
    if (req.url === '/') return respondText(req,res)
    if (req.url === '/json') return respondJson(req,res);
    if (req.url.match(/^\/echo/)) return respondEcho(req, res);
    if (req.url.match(/^\/static/)) return respondStatic(req, res);
    respondNotFound(req,res);
})

server.listen(port)
console.log(`Server listening on port ${port}`)


// Stopped at Dynamic responses ....