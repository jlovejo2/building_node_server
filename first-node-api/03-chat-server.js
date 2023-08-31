const fs = require('fs')
const express = require('express')
const EventEmitter = require('events')

const chatEmitter = new EventEmitter();
chatEmitter.on('message', console.log)

const port = process.env.POR || 1337;

const app = express()

function respondNotFound (req, res) {
    res.writeHeader(404, { 'Content-Type': 'text/plain' })
    res.end('Not Found')
  }

function respondChat (req, res) {
    const { message } = req.query;

    chatEmitter.emit('message', message)
    res.end()
}

function respondSSE (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
    })

    const onMessage = msg => res.write(`data: ${msg}\n\n`)
    chatEmitter.on('message', onMessage)

    res.on('close', function() {
        chatEmitter.off('message', onMessage)
    })
}


function respondStatic (req, res) {
    const filename = `${__dirname}/public/${req.params[0]}`

    // this creates a stream object for our chosen file. the pipe() method connects this stream object to the response.
    // behind the scenes it is loading the data from filesystem and sends to the client on the response
    fs.createReadStream(filename)
      .on('error', () => respondNotFound(req, res))
      .pipe(res)
  }

app.get('/chat', respondChat)
app.get('/sse', respondSSE)
app.get('/static/*', respondStatic)

app.listen(port, () => console.log(`Server listening on port ${port}`))
