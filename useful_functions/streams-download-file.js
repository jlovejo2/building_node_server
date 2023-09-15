const fs = require('fs');
const https = require('https');

const fileUrl =
    'https://www.newline.co/fullstack-react/assets/images/fullstack-react-hero-book.png';

https.get(fileUrl, res => {

    /** 
     * grabs all the data chunks and places them into an array, cause if it is a large file there could be multiple.  
     * only once we receive end event do we save the file.  
     * Buffer.concat on an array of chunks with condense the chunks into a single chunk.  Also fs.writeFile is perfectly happy with Buffer type as second param
     * downsides to this approach is that since we are writing the chunks to memory instead of saving to disk, with large files available memory could be exceeded
    
        const chunks = []
    
        res.on('data', data => chunks.push(data)).on('end', () => {
            fs.writeFile('book.png', Buffer.concat(chunks), err => {
                if (err) console.error('Error in writing file:', err)
                console.log('File saved!');
            })
        })
    */

    /**  
     * this approach is using writeStream so the image data is not buffered in memory
    
        const fileStream = fs.createWriteStream('book.png');
        res.on('data', data => fileStream.write(data)).on('end', () => {
            fileStream.end()
            console.log('file saved!');
        })
    */

    // this approach uses the build in pipe() method which takes care of all the individual event listening for us.
    // this is possible because streams are standardized.
    res
        .pipe(fs.WriteStream('book.png'))
        .on('finish', () => console.log('file saved!'))
})

