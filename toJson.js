const fs = require('fs');
const sizeOf = require('image-size');

const directoryPath = './gifs_media';

// Read the contents of the directory
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.log('Error getting directory contents:', err);
    } else {
        // Log the array of file names
        console.log('Files in the directory:', files.length);
        const txtOnly = files.filter((file) => /.*\.txt$/.test(file));
        console.log('txt Files in the directory:', txtOnly.length);
        
        const fileNames = txtOnly.map((file) => file.slice(0, -4));
        console.log('txt File names in the directory:', fileNames);

        const myJson = [];

        for (const name of txtOnly) {
            const file = name.slice(0, -4)
            try {
                // Read the contents of the file synchronously
                const data = fs.readFileSync("./gifs_media/" + name, 'utf8');
                console.log('File contents:', data);
                const dimensions = sizeOf("./gifs_media/" + file + ".gif");

                myJson.push({
                    file,
                    tags: data.split(", "),
                    width: dimensions.width,
                    height: dimensions.height,
                })
            } catch (err) {
                console.error('Error reading file:', err);
            }
        }


        console.log(myJson)


        try {
            // Convert the JavaScript object to JSON and write it to the file synchronously
            fs.writeFileSync("./tags.json", JSON.stringify(myJson, null, 2), 'utf8');
            console.log('Data has been written to the file successfully.');
        } catch (err) {
            console.error('Error writing to file:', err);
        }
    }
});
