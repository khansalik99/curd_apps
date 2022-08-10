const AdminModel = require('../models/admin');
const bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator');
//for rendering list-songs
exports.getAdmins = (req, res, next) => {
    AdminModel
        .find()
        .then(admins => {
            // console.log('songs', songs);
            const isAdmin = req.session.userType === 'isAdmin' ? 'isAdmin' : 'isUser';
            const isAuthenticated = req.session.isLoggedIn ? req.session.isLoggedIn : false;
            res.render('all-admins', {
                pageTitle: "Admin - All Admins",
                isAdmin: isAdmin,
                isAuthenticated: isAuthenticated,
                admins: admins
            });
        });
}
//show add user form/page
exports.getAdd_Admin = (req, res, next) => {
    AdminModel
        .find()
        .then(admins => {
            const isAdmin = req.session.userType === 'isAdmin' ? 'isAdmin' : 'isUser';
            const isAuthenticated = req.session.isLoggedIn ? req.session.isLoggedIn : false;
            res.render('add-admin', {
                pageTitle: "Admin-Add admin",
                isAdmin: isAdmin,
                isAuthenticated: isAuthenticated,
                admins: admins
            })
        });
}
// //to save new admin in db
exports.postAdd_Admin = async (req, res) => {
    let adminName =  req.body.name;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    };
    let newAdmin = await AdminModel.findOne({ username: adminName });
    console.log(newAdmin);
    if(!newAdmin){
        console.log(`${req.body.username} admin doesn't exist before`);
    }
    if (newAdmin) {
        req.session.error = "This admin already exists";
        return res.redirect("/admin-controls/add-admin");
    }
    // validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    const hashedPass = await bcrypt.hash(req.body.password, 12);
    //create new admin instance
    const admin = new AdminModel({
        username: req.body.name,
        email: req.body.email,
        password: hashedPass,
        userType: "isAdmin"
    });
    //save it to data base
    admin.save()
        .then(addedAdmin => {
            console.log(addedAdmin + "added!");
            res.redirect('/admin-controls/all-admins');
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while adding a new song" })
        });
}