/**
 * @author Josh Dean <joshudea@cisco.com>
 * @author Pedro Oliveira <peolivei@cisco.com>
 * @copyright Copyright (c) 2020 Cisco and/or its affiliates.
 * @license Cisco Sample Code License, Version 1.1
 */

/**
 * @license
 * Copyright (c) 2020 Cisco and/or its affiliates.
 *
 * This software is licensed to you under the terms of the Cisco Sample
 * Code License, Version 1.1 (the "License"). You may obtain a copy of the
 * License at
 *
 *                https://developer.cisco.com/docs/licenses
 *
 * All use of the material herein must be in accordance with the terms of
 * the License. All rights not expressly granted by the License are
 * reserved. Unless required by applicable law or agreed to separately in
 * writing, software distributed under the License is distributed on an "AS
 * IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied.
 */

//Import path and file system to access files
const path = require('path');
var fs = require('fs');
const e = require('express');

//Assets I want to copy over
const ASSETS = [
    'bulma/css/bulma.css',
    'font-awesome/css/font-awesome.css'
];

const FONTS = [
    'font-awesome/fonts/FontAwesome.otf',
    'font-awesome/fonts/fontawesome-webfont.eot',
    'font-awesome/fonts/fontawesome-webfont.svg',
    'font-awesome/fonts/fontawesome-webfont.ttf',
    'font-awesome/fonts/fontawesome-webfont.woff',
    'font-awesome/fonts/fontawesome-webfont.woff2'
]

//If the folder doesn't exit make it
//Useful for .gitignore
if (!fs.existsSync('./public/dependencies')){
    console.log('Build Process: Building Front-End Dependencies Folder')
    fs.mkdirSync('./public/dependencies');
}
if (!fs.existsSync('./public/fonts')){
    console.log('Build Process: Building Front-End Fonts Folder')
    fs.mkdirSync('./public/fonts');
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
        console.log(`Build Process: '${asset}' Imported to Front-End Dependencies`)
     } //If the node module isnt installed
     else {
        console.log(`${from} does not exist.\nUpdate the build.js script with the correct file paths.`)
        process.exit(1)
    }
});

//Map the font assets into the public folder 
FONTS.map(asset => {
    //get the last part of the filepath 
    //e.g. /bulma.css
    let filename = asset.substring(asset.lastIndexOf("/") + 1);

    //get the file path of the module from node_modules
    //e.g. ./node_modules/bulma/css/bulma.css
    let from = path.resolve(__dirname, `./node_modules/${asset}`)

    //build the destination file path with the filename
    //e.g. ./public/dependencies/bulma.css
    let to = path.resolve(__dirname, `./public/fonts/${filename}`)

    //If the node module is installed
    if (fs.existsSync(from)) {
        fs.createReadStream(from).pipe(fs.createWriteStream(to));
        console.log(`Build Process: '${asset}' Imported to Front-End Fonts`)
     } //If the node module isnt installed
     else {
        console.log(`${from} does not exist.\nUpdate the build.js script with the correct file paths.`)
        process.exit(1)
    }
});