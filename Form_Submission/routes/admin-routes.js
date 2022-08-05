const express = require('express');
//const services = require('../services/render');
const router = express.Router();
const { isAuth } = require("../public/js/isAuth");
const {checkAdmin} = require("../route-protection/checkAdmin")

const adminController = require("../controller/admin-controller");

router.get('/dash',isAuth,checkAdmin,adminController.adminDashGet);
router.post('/dash',isAuth,adminController.Adminlogout);
// router.post('/',adminController.adminPageGet);
// router.get('/register',adminController.registerGet);
// router.post('/register',adminController.registerPost);
module.exports = router;
