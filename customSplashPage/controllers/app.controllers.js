const Duo = require('../node_modules/@duosecurity/duo_web/index'); 
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

    //Build the signrequest with the .env and the username
    const sigRequest = Duo.sign_request(iKey, sKey, aKey, username);

    //create an object to hold the information to pass to the front end
    let userInformation = {
        duoHost : host,
        duoSig : sigRequest.toString() 
    }

    //render the front end with the information above templated in
    res.render('stage-two', userInformation);
}

