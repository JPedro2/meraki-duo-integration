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

//Main Server File of the project

//------------- Modules Loading ----------------
require('dotenv').config()
const express = require('express');
const exphbs  = require('express-handlebars');
const cors = require('cors');
const path = require("path");
const routes = require("./routes/app.routes")
const bodyParser = require('body-parser');
const Duo = require('./node_modules/@duosecurity/duo_web/index');
const uniqid = require('uniqid');

let session = require('express-session'); 
const { Console } = require('console');
//Establish port for the app
const port = process.env.PORT || 3006;



//Create an instance of express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

//Generate a key based on current time, process and machine name.
let sessionKey = uniqid();

//Set up sessions
app.use(session({
    secret : sessionKey,
    resave : false,
    saveUninitialized : false
}));
  

//Assigning Rendering engine to express
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set("views", path.join(__dirname, "views"));


// Public holds things like CSS, local JS and Images
app.use('/', express.static(__dirname + "/public"));

// Redirect needed CSS from node modules 
app.use('/css', express.static(__dirname + '/node_modules/bulma/css')); 
app.use('/css', express.static(__dirname + '/node_modules/@okta/okta-signin-widget/dist/css'));

// Redirect needed JS from node modules
app.use('/js', express.static(__dirname + '/node_modules/@okta/okta-signin-widget/dist/js'));

//Set the server to user established routes
app.use(routes);



//Makes the app listen to port 3006
app.listen(port, () => console.log(`Captive portal listening to port ${port}`));