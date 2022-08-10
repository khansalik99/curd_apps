const UserModel = require('../models/user');
const bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator');
//for rendering list-songs
exports.getUsers = (req, res) => {
    UserModel
        .find()
        .then(users => {
            const isAdmin = req.session.userType === 'isAdmin' ? 'isAdmin' : 'isUser';
            const isAuthenticated = req.session.isLoggedIn ? req.session.isLoggedIn : false;
            res.render('all-users', {
                pageTitle: "Admin - All Users",
                isAdmin: isAdmin,
                isAuthenticated: isAuthenticated,
                users: users
            });
        });
}
//show add user form/page
exports.getAdd_User = (req, res) => {
    UserModel
        .find()
        .then(users => {
            const isAdmin = req.session.userType === 'isAdmin' ? 'isAdmin' : 'isUser';
            const isAuthenticated = req.session.isLoggedIn ? req.session.isLoggedIn : false;
            res.render('add-user', {
                pageTitle: "Admin-Add New User",
                isAdmin: isAdmin,
                isAuthenticated: isAuthenticated,
                users: users
            })
        });
}
//to save new user in db
exports.postAdd_User = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    };
    let userName =  req.body.name;
    let newUser = await UserModel.findOne({ username: userName });
    if(!newUser){
        console.log(`${req.body.username} user doesn't exist before`);
    }
    if (newUser) {
        req.session.error = "This user already exists";
        return res.redirect("/admin-controls/add-user");
    }
    // validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    const hashedPass = await bcrypt.hash(req.body.password, 12);
    //create new admin instance
    const user = new UserModel({
        username: req.body.name,
        email: req.body.email,
        password: hashedPass,
        userType: "isUser"
    });
    //save it to data base
    user.save()
        .then(addedUser => {
            console.log(addedUser + "added!");
            res.redirect('/admin-controls/all-users');
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while adding a new song" })
        });
}