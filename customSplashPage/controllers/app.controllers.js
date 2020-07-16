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

const Duo = require('../node_modules/@duosecurity/duo_web/index');
const fetch = require('node-fetch');
const btoa = require('btoa');
var log4js = require("log4js");
const { json } = require('body-parser');

//Instantiate the logger
var logger = log4js.getLogger();
//Set the logging levels
logger.level = "debug";

//Render the First Page 
exports.signOn = (req, res) => {
    //save the users session variables in session storage
    req.session.base_grant_url = req.query.base_grant_url;
    req.session.user_continue_url = req.query.user_continue_url;

    //Render Page with the user
    res.render('sign-on');
}

//Render the Second Page
exports.stageTwo = (req, res) => {
    //Grab all the keys for duo from your .env 
    iKey = process.env.ikey
    sKey = process.env.skey
    aKey = process.env.akey
    host = process.env.host

    //Grab the username from the signin form submitted
    username = req.body.username
    password = req.body.password

    req.session.username = req.body.username;

    //Encode the usernames and passwords
    let to_encode = username + ":" + password;
    let base64_encoded = btoa(to_encode);

    //Check Credentials against april
    fetch(process.env.baseUrlAuth + "/api/auth/token", {
            method: 'GET',
            headers: {
                "Authorization": "Basic " + base64_encoded,
                "Access-Control-Allow-Origin": "*"
            }
        })
        .then((res) => { 
            status = res.status; //get the status of the api call
            
            if (status == 200) {
                return res.json()
            } //convert the response into json
          })
          .then((jsonData) => {

            if (status === 200) { //If the login credentials are okay
                
                
                //save the auth token for the user 
                req.session.authToken = jsonData.token;
                //Build the signrequest with the .env and the username
                const sigRequest = Duo.sign_request(iKey, sKey, aKey, username);

                //create an object to hold the information to pass to the front end
                let userInformation = {
                    duoHost: host,
                    duoSig: sigRequest.toString(),
                    duoPost: "/authSuccess"
                }

                //Log the user has passed first auth stage
                logger.info(`User ${username} has passed the first stage of authentication`)

                //render the front end with the information above templated in
                res.render('stage-two', userInformation);
            } else { //If there is an issue with the login credentials

                //send them back to stage one with an error flag
                res.render('sign-on', {
                    error: true
                });

                logger.warn(`User ${username} has failed authentication.`)
                

            }
        }).catch(err => {
            console.log(err);
        })
}



exports.signOnOkta = (req, res) => {
    //save the users session variables in session storage
    req.session.base_grant_url = req.query.base_grant_url;
    req.session.user_continue_url = req.query.user_continue_url;
    req.session.client_mac = req.query.client_mac;
    req.session.client_ip = req.query.client_ip;

    //Log User has requested the page
    logger.info(`User ( ${req.query.client_ip} | ${req.session.client_mac} ) has began authentication process`);
    logger.debug(`User ( ${req.query.client_ip} | ${req.session.client_mac} ) grant URL is: ${req.query.base_grant_url}`)
    
    //build out the url endpoint for successful auth to pass to okta 
    let successEndpoint = 'http://' + req.headers.host + "/success"

    //Insert the successendpoint into an object
    let userInformation = {
        successURL: successEndpoint,
        baseUrlOKTA: process.env.baseUrlOKTA
    }

    //Render Page with the success url
    res.render('okta', userInformation);
}

//Success Controller for Okta sign on
exports.success = (req, res) => {

    //construct the meraki success url which grants network access
    successUrl = req.session.base_grant_url + "?continue_url=" + req.session.user_continue_url + "&duration=43200";

    //Token passed in from the front-end successful auth
    let userToken = req.params;

    //build out a url using okta redirect with meraki auth url
    //If the token is valid redirect will be successful
    let grant = process.env.baseUrlOKTA + '/login/sessionCookieRedirect?token=' + userToken.token + '&redirectUrl=' + successUrl
    
    //Log where the user is going to go 
    logger.debug(`User ( ${req.session.client_ip} | ${req.session.client_mac} ) has authenticated client side, redirecting to: ${req.session.user_continue_url}`)
    
    //redirect to the webpage
    res.redirect(grant);
}



//Success Controller for Custom Auth (Non Okta)
exports.authSuccess = (req,res) => {

    let authToken = req.session.authToken//Token from april sign-in to verify
    let signedResponse = req.body.sig_response;  //Posted back from duo to verify
    

    fetch(process.env.baseUrlAuth + "/api/auth/checkPosture", {
        method: 'GET',
        headers: {
            "Authorization": 'Bearer ' + authToken,
            "Access-Control-Allow-Origin": "*"
        }
    })
    .then((response) => { 
        let status = response.status; //get the status of the api call

        if (status == 200){ //Username and password have been entered correctly
            let authenticated_username = Duo.verify_response(process.env.ikey, process.env.skey, process.env.akey, signedResponse) //verify the duo has actually passed

            if (authenticated_username) {
                let successUrl = req.session.base_grant_url + "?continue_url=" + req.session.user_continue_url + "&duration=43200";
                
                logger.info(`User ${req.session.username} has fully authenticated, redirecting to: ${req.session.user_continue_url}`)
                
                res.redirect(successUrl);
            }
            else {
                logger.warn(`User ${req.session.username} has failed authenticaiton due to failed 2FA.`)
            }
            
        } else { //Username and password have been entered incorrectly 

            logger.warn(`User ${req.session.username} has failed authenticaiton with an incorrect Username / Password.`)

            res.render('sign-on', {
                error: true
            });
        }
    })
      .catch(err => {
        console.log(err);
     })
    

}