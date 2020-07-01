const Duo = require('../node_modules/@duosecurity/duo_web/index'); 
const fetch = require('node-fetch');
const btoa = require('btoa');
//Render the First Page 
exports.signOn = (req, res) => {

    //Gather the user data from the request
    let userInformation = {
        
    }
    
    //Render Page with the user
    res.render('sign-on', userInformation);
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
                duoSig : sigRequest.toString() 
            }

            console.log("yes")
           
            
            //render the front end with the information above templated in
            res.render('stage-two', userInformation);
        } else { //If there is an issue with the login credentials
            
            //send them back to stage one with an error flag
            res.render('sign-on', {error: true});
            
            console.log("no")
        }
    }).catch(err => {
        console.log(err);
    })
}

