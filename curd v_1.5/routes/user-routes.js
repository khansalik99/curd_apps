const express = require('express');

const router = express.Router();

const userController = require("../controllers/user-controller");
const { isAuth } = require("../helpers/isAuth");

//User Dashboard Page
router.get('/dashboard',isAuth, userController.dashboard_get);

module.exports = router;