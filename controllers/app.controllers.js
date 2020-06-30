
//Sign on page controller 
exports.signOn = (req, res) => {

    //Gather the user data from the request
    let userInformation = {
        //meraki injected code needs to go here
    }
    
    //Render Page with the user
    res.render('sign-on', userInformation);
}