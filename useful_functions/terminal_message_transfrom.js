const http = require('http')
const readline = require('readline')
const querystring = require('querystring');

// process.stdin is a data source that will contain any text that a user types in while Node.js app is running
const rl = readline.createInterface({ input: process.stdin })

rl.on('line', line => {
    http.get(
        `http://localhost:1337/chat?${querystring.stringify({ message: line })}`
    )
})

// stopped at Creating custom emitters .....