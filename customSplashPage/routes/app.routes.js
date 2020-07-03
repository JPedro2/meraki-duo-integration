//------------- Import Modules ----------------
const express = require("express");
const router = express.Router();

//Local Imports
const appController = require('../controllers/app.controllers')

//Routes for Pages
router.get('/signon', appController.signOn)
router.get('/signonokta', appController.signOnOkta)
router.post('/stageTwo', appController.stageTwo)
router.post('/success', appController.success)
router.get('/success', appController.success)


module.exports = router;