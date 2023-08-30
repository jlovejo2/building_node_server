const fs = require('fs')
const express = require('express')

const port = process.env.POR || 1337

const app = express()

function respondText (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.end('Howdy')
}

function respondJson (req, res) {
  res.setHeader('Content-type', 'application/json')
  res.end(JSON.stringify({ text: 'Howdy', numbers: [1, 2, 3] }))
}

function respondNotFound (req, res) {
  res.writeHeader(404, { 'Content-Type': 'text/plain' })
  res.end('Not Found')
}

function respondEcho (req, res) {
  const { input = '' } = req.query

  res.json(
    {
      normal: input,
      shouty: input.toUpperCase(),
      characterCount: input.length,
      backwards: input.split('').reverse().join('')
    }
  )
}

function respondStatic (req, res) {
  const filename = `${__dirname}/public${req.params[0]}`
  // this creates a stream object for our chosen file. the pipe() method connects this stream object to the response.
  // behind the scenes it is loading the data from filesystem and sends to the client on the response
  fs.createReadStream(filename)
    .on('error', () => respondNotFound(req, res))
    .pipe(res)
}

app.get('/', respondText)
app.get('/json', respondJson)
app.get('/echo', respondEcho)
app.get('/static/*', respondStatic)

app.listen(port, () => console.log(`Server listening on port ${port}`))
