const express = require('express');
const router = express.Router();
const { isAuth } = require("../public/js/isAuth");
//const mainController = require("../controller/main-controller");

const dashController = require("../controller/dash-controller");

router.get('/dash',isAuth,dashController.showPage);
router.post('/dash',isAuth,dashController.logout);
module.exports = router;