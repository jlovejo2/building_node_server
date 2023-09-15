const http = require('http')
const readline = require('readline')
const querystring = require('querystring');
const EventEmitter = require('events');

// process.stdin is a data source that will contain any text that a user types in while Node.js app is running
const rl = readline.createInterface({ input: process.stdin })

rl.on('line', line => {
    http.get(
        `http://localhost:1337/chat?${querystring.stringify({ message: line })}`
    )
})

// in this line of code basically after we make a request we need to wait for the response. 
// The response obj doesn't come with all the data so we subscrive to the "data" events.
function createEventSource (url) {
    const source = new EventEmitter()

    http.get(url, res => {
        res.on('data', data => {
            const message = data
                .toString()
                .replace(/^data: /, '')
                .replace(/\n\n$/, '')
            
            source.emit('message', message)
            const eventType = message.match(/\?$/) ? 'question' : 'statement';
            source.emit(eventType, message);
        })
    })

    return source;
}

const source = createEventSource('http://localhost:1337/sse');


source.on('statement', s => console.log(`Someone stated, "${s}"`))
source.on('question', q => console.log(`Someone asked, "${q}"`))