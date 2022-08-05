const mongodb = require('mongodb');
const Admin = require('../models/admin');
const User = require('../models/user');
const { isAuth } = require("../public/js/isAuth");

exports.adminDashGet = (req, res, next) => {
    // console.log("Page is showing")
      res.render('admin-dashboard');
 };

 exports.Adminlogout = (req, res) => {
    // req.session.isAuth =false;
    // console.login(req.session.isAuth);
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect("/");
    })
}