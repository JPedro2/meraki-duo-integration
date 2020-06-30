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
    
    console.log(req.body)


    iKey = 'DIKGB7228EPKOLUKNN9E'
    sKey = 'Ny9lETG5ELt1JugvmO90cfXSy10jFOxvWS60fXPe'
    aKey = 'a62dc8b67a0423ea49466501c02aded43f4be1cb'
    username = "dookah"

    //create a sigRequest
    const sigRequest = Duo.sign_request(iKey, sKey, aKey, username);

    console.log(sigRequest)
    
    //res.json({sigRequest, host: creds.host});
    
    let userInformation = {
        duoHost : 'api-3d03e7b6.duosecurity.com',
        duoSig : JSON.stringify(sigRequest)
    }

    
    res.render('stage-two', userInformation);
}

