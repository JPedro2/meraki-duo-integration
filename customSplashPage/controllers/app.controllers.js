const Duo = require('../node_modules/@duosecurity/duo_web/index'); 
const fetch = require('node-fetch');
const btoa = require('btoa');
//Render the First Page 
exports.signOn = (req, res) => {
    console.log('-------------------------------')
    console.log('A User has requested the splash page')
    console.log('--- --- --- --- --- --- --- ---')
    console.log(`Meraki Grant URL is: ${req.query.base_grant_url}`)
    console.log(`Meraki Continue URL is: ${req.query.user_continue_url}`)
    console.log(`Users ip address: ${req.query.client_ip}`)
    console.log(`Users mac address: ${req.session.client_mac = req.query.client_mac}`)

    //save the users session variables in session storage
    req.session.base_grant_url = req.query.base_grant_url;
    req.session.user_continue_url = req.query.user_continue_url;

    //Render Page with the user
    res.render('sign-on');
}

//Render the Second Page
exports.stageTwo = (req,res) => {
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
    let to_encode = username+":"+password;
    let base64_encoded = btoa(to_encode);

    //Check Credentials against april
    fetch(process.env.baseUrlAuth + "/api/auth/token",{
        method: 'GET',
        headers: {
            "Authorization" : "Basic "+base64_encoded,
            "Access-Control-Allow-Origin" : "*" 
        }
    })
    .then(function(response) {
        if(response.status === 200) { //If the login credentials are okay
            
            //Build the signrequest with the .env and the username
            const sigRequest = Duo.sign_request(iKey, sKey, aKey, username);
            
            //create an object to hold the information to pass to the front end
            let userInformation = {
                duoHost : host,
                duoSig : sigRequest.toString(),
                duoPost: "/success"
            }
            
            //Log the user has passed first auth stage
            console.log('-------------------------------')
            console.log(`User ${username} has passed the first stage of authentication.`)
            
            //render the front end with the information above templated in
            res.render('stage-two', userInformation);
        } else { //If there is an issue with the login credentials
            
            //send them back to stage one with an error flag
            res.render('sign-on', {error: true});
            console.log('-------------------------------')
            console.log(`User ${username} has FAILED the first stage of authentication.`)
            
        }
    }).catch(err => {
        console.log(err);
    })
}

exports.success = (req,res) => {
    //Log the user has passed duo
    console.log('-------------------------------')
    console.log(`User ${req.session.username} the second stage of authentication.`)

    //construct the success url
    successUrl = req.session.base_grant_url + "?continue_url=" + req.session.user_continue_url + "&duration=43200";

    //Log where the user is going to go 
    
    console.log(`Redirecting User ${req.session.username} to ${successUrl}`)
    

    //redirect to the webpage
    res.redirect(successUrl);
    
}