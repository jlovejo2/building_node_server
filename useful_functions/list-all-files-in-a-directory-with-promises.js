const fs = require('fs').promises;
const path = require('path');

const targetDirectory = process.argv[2] || './';

getFileLengths( targetDirectory)
    .then(results => {
        results.forEach(([file, length]) => console.log(`${file}: ${length}`));
        console.log('done!');
    })
    .catch(err => console.error(err))

function getFileLengths(dir) {
    return fs.readdir(dir).then(fileList => {
        const readFiles = fileList.map(file => {
            const filePath = path.join(dir, file)
            return readFile(filePath)
        })
        return Promise.all(readFiles)
    })
}

function readFile(filePath) {
    return fs
        .readFile(filePath)
        .then(data => [filePath, data.length])
        .catch(err => {
            if (err.code === 'EISDIR') return [filePath, 0]
            throw err
        })
}

/** 
 *  Two main benefits to promises vs callbacks
 * 1) Promise.all() is globablly available and handles the functions for us so we don't need to build our own mapASync function
 * 2) errors are automatically propogated along the promise chain for us.   can be caught in the .cath(). Don't have to return early when error is found

*/