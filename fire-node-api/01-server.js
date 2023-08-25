// this loads the core module http which means it is always available via require() in node
const http = require('http');

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

// request listener is called everytime there is a request to the server.
const server = http.createServer(function (req, res) {
    if (req.url === '/') return respondText(req,res)
    if (req.url === '/json') return respondJson(req,res);

    respondNotFound(req,res);
})

server.listen(port)
console.log(`Server listening on port ${port}`)


// Stopped at Dynamic responses ....