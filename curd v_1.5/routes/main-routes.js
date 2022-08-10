const express = require('express');
const services = require('../services/render');
const router = express.Router();
const accountsController = require("../controllers/accounts-controller");
const userController = require("../controllers/user-controller");
const {isAuth} = require("../helpers/isAuth");
const {isLoggedIn} = require("../helpers/isLoggedIn");
const { loginValidation, signUpValidation, passwordResetValidation } = require("../helpers/validation");

/**
 * @description Root Route
*/
//landing page-Index
router.get('/', services.defaultRoute);

//Login Page
router.get('/login', isLoggedIn, accountsController.login_get);
router.post('/login', loginValidation, accountsController.login_post);

//Registration Page
router.get('/registration', isLoggedIn, accountsController.registration_get);
router.post('/registration', signUpValidation,accountsController.registration_post);
//Reset Password
router.get('/reset-password', accountsController.resetPass_get);
router.post('/reset-password', passwordResetValidation, accountsController.resetPass_post);
//Log Out 
router.post("/logout", isAuth, accountsController.logout_post);
module.exports = router;
