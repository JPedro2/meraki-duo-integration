//Import path and file system to access files
const path = require('path');
var fs = require('fs');
const e = require('express');

//Assets I want to copy over
const ASSETS = [
    'bulma/css/bulma.css',
    'font-awesome/css/font-awesome.css',
    'font-awesome/fonts/fontawesome-webfont.woff'
];

//If the folder doesn't exit make it
//Useful for .gitignore
if (!fs.existsSync('./public/dependencies')){
    console.log('Build Process: Building Front-End Dependencies Folder')
    fs.mkdirSync('./public/dependencies');
}

//Map the assets into the public folder 
ASSETS.map(asset => {
    //get the last part of the filepath 
    //e.g. /bulma.css
    let filename = asset.substring(asset.lastIndexOf("/") + 1);

    //get the file path of the module from node_modules
    //e.g. ./node_modules/bulma/css/bulma.css
    let from = path.resolve(__dirname, `./node_modules/${asset}`)

    //build the destination file path with the filename
    //e.g. ./public/dependencies/bulma.css
    let to = path.resolve(__dirname, `./public/dependencies/${filename}`)

    //If the node module is installed
    if (fs.existsSync(from)) {
        fs.createReadStream(from).pipe(fs.createWriteStream(to));
        console.log(`Build Process: '${asset}' Imported to Frone-End Dependencies`)
     } //If the node module isnt installed
     else {
        console.log(`${from} does not exist.\nUpdate the build.js script with the correct file paths.`)
        process.exit(1)
    }
});