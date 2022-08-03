const express = require('express');
const services = require('../services/render');
const router = express.Router();

/**
 * @description Root Route
* @method GET /
*/
router.get('/', services.defaultRoute);
router.get('/login', services.loginRoute);


module.exports = router;
