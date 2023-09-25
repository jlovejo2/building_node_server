const fs = require('fs');
const csv = require ('csv-parser');
const { Transform } = require('stream');


// example of what csv data looks like
// name,dob
// Liam Jones,1988-06-26
// Maximus Rau,1989-08-21
// Lily Ernser,1970-01-18
// Alvis O'Keefe,1961-01-19
// ...

const YEAR_MS = 365 * 24 * 60 * 60 * 1000

fs.createReadStream('people.csv')
    .pipe(csv())
    .pipe(clean())
    .on('data', row => console.log(JSON.stringify(row)))


function clean() {
    return new Transform({
        // this needs to be set to true because of the csv-parser and how it is converting the csv data to a json object.
        // Streams are designed to handle string and buffer so need to tell it we delivering json objects to it
        objectMode: true,
        transform(row, encoding, callback) {
            const [firstName, lastName] = row.name.split(' ')
            const age = Math.floor((Date.now() - new Date(row.dob)) / YEAR_MS)
            callback(null, { firstName, lastName, age })
        }
    })
}