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


//Public holds things like CSS, local JS and Images
app.use(express.static(__dirname + "/public"));
app.use(routes);


//Makes the app listen to port 3006
app.listen(port, () => console.log(`App listening to port ${port}`));