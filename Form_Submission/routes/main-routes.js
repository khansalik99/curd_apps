const express = require('express');
//const services = require('../services/render');
const router = express.Router();
const { isAuth } = require("../public/js/isAuth");

const mainController = require("../controller/main-controller");

router.get('/',mainController.signinGet);
router.post('/',mainController.mainPageGet);
router.get('/register',mainController.registerGet);
router.post('/register',mainController.registerPost);
module.exports = router;
