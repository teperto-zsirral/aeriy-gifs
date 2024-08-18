const fs = require('fs');

const directoryPath = './new';

// Read the contents of the directory
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.log('Error getting directory contents:', err);
    } else {
        // Log the array of file names
        console.log('Files in the directory:', files.length);
        const gifOnly = files.filter((file) => /.*\.gif$/.test(file));
        console.log('gif Files in the directory:', gifOnly.length);
        
        const fileNames = gifOnly.map((name) => name.slice(0, -4));
        console.log('gif File names in the directory:', fileNames);

        for (const name of fileNames) {
            try {
                fs.writeFileSync("new/" + name + ".txt", "", 'utf8');
                console.log('Data has been written to the file successfully.');
            } catch (err) {
                console.error('Error writing to file:', err);
            }
        }
    }
});
