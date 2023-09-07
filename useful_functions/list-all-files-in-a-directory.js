const fs = require('fs');
const path = require('path');

// running this file in node will list all the files and there lengths in a specified directory;

const targetDirectory = process.argv[2] || './';

getFileLengths( targetDirectory, function (err, results) {
  if (err) return console.error(err);

  results.forEach(([file, length]) => console.log(`${file}: ${length}...`));

  console.log('done!')
})

function mapAsync (arr, fn, onFinish) {
  let prevError
  let nRemaining = arr.length;
  const results = [];

  arr.forEach(function (item, i) {
    // this map Async expects fn to be an async function with a callback.  Shown here
    fn(item, function (err, data) {
      // this is to prevent onFinish from being called if the previous item errored.
      if (prevError) return
      
      if (err) {
        prevError = err
        return onFinish(err);
      }

      results[i] = data;

      // completed without an error.  Decrement nRemaining so we can keep track how many are left.
      nRemaining--
      if (!nRemaining) onFinish(null, results)
    })
  })
}

// fs.readdir('./', (err, files) => {
//   if (err) return console.error(err)

//   mapAsync(files, fs.readFile, (err, results) => {
//     if (err) return console.error(err);

//     results.forEach((data, i) => console.log(`${files[i]}: ${data.length}`))
  
//     console.log('done!');
//   })
// })

function getFileLengths (dir, cb) {
  fs.readdir(dir, function (err, files) {
    if (err) return cb(err);

    const filePaths = files.map(file => path.join(dir, file));
    
    mapAsync(filePaths, readFile, cb)
  })
}

function readFile(file, cb) {
  fs.readFile(file, function(err, fileData) {
    if (err) {
      if (err.code === 'EISDIR') return cb(null, [file, 0])
      return cb(err)
    }
    cb(null, [file, fileData.length])
  })
}