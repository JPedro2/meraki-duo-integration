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

//------------- Import Modules ----------------
const express = require("express");
const router = express.Router();

//Local Imports
const appController = require('../controllers/app.controllers')

//Routes for Pages

//Custom Auth Routes
router.get('/signon', appController.signOn)
router.post('/stageTwo', appController.stageTwo)
router.post('/authSuccess', appController.authSuccess)


//Okta Auth Routes
router.get('/signonokta', appController.signOnOkta)
router.post('/success/:token', appController.success)


module.exports = router;