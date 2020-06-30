//------------- Import Modules ----------------
const express = require("express");
const router = express.Router();

//Local Imports
const appController = require('../controllers/app.controllers')

//route to load sign on page
router.get('/signon', appController.signOn)

module.exports = router;