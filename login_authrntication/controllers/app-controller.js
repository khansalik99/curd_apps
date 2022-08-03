const User = require('../models/user');
const Admin = require('../models/admin');
const bcrypt = require("bcryptjs");
const session = require('express-session');
const MongoDbSession = require('connect-mongodb-session')(session);

exports.login_get = (req, res) => {
    const isAuthenticated = req.session.isLoggedIn ? req.session.isLoggedIn : false;
    const isAdmin = req.session.userType === 'isAdmin' ? 'isAdmin' : 'isUser';
    const error = req.session.error;
    delete req.session.error;
    console.log("login_get-->isAuthenticated: ", isAuthenticated)
    res.render('login', {
        pageTitle: 'Log In',
        isAdmin: isAdmin,
        isAuthenticated: isAuthenticated,
        err: error
    });
}

exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    const user = await User.findOne({ email });
 
        if (admin) {
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            req.session.error = "Invalid Admin Password"
            return res.redirect('/login');
        }
        req.session.username = admin.username;
        req.session.admin = admin;
        req.session.isLoggedIn = true,
        req.session.isAuth = true;
        req.session.userType = "isAdmin";
        console.log("Admin LOGIN--GET--req.session.userType", req.session.userType);
        res.redirect("/admin/admin-dashboard");
    }
    // }
    else if (user) {
        const userType ='isUser';
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            req.session.error = "Invalid User Password"
            return res.redirect('/login');
        }
        req.session.username = user.username;
        req.session.user = user;
        req.session.isLoggedIn = true,
        req.session.isAuth = true;
        req.session.userType = "isUser";
        console.log("User LOGIN--GET--req.session.userType", req.session.userType);
        res.redirect("/dashboard");
    }
     if (!user && !admin) {
            req.session.error = "Invalid email";
            return res.redirect('/login');
        }
   
}
exports.registration_get = (req, res) => {
    const isAuthenticated = req.session.isLoggedIn ? req.session.isLoggedIn : false;
    // const isAdmin = req.session.userType === 'isAdmin' ? 'isAdmin' : 'isUser';
    console.log("registration_get -->isAuthenticated: ", isAuthenticated)
    res.render('registration', {
        pageTitle: 'Registration',
        // isAdmin: isAdmin,
        isAuthenticated: isAuthenticated
    });
}
exports.registration_post = async (req, res) => {
        const userEmail = req.body.email;
        let user = await User.findOne({ email : userEmail });
        let admin = await Admin.findOne({ email : userEmail });
        let repeatPassMatch;
        if (user || admin) {
            req.session.error = "This user already exists";
            console.log("This user already exists");
            return res.redirect("/registration");
        }
    if (req.body.password === req.body.repeatPassword ){
         repeatPassMatch = true;
    }else{
        repeatPassMatch=false;
    }

    if(repeatPassMatch === true){
        const hashedPass = await bcrypt.hash(req.body.password, 12);
        user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
            userType: 'isUser'
        })
        await user.save();
        res.redirect("/login");
    }else{
        res.redirect("/registration");
    }
    };
// exports.registration_post = async (req, res) => {
//     console.log("username", req.body.username);
//     console.log("Email", req.body.email);
//     console.log("Password", req.body.password);
//     console.log("UserType", req.body.isAdmin);
//     const userType = req.body.isAdmin;

//     if (userType === 'isAdmin') {
//         const adminEmail = req.body.email;
//         let admin = await Admin.findOne({ adminEmail });
//         if (admin) {
//             req.session.error = "This admin already exists";
//             return res.redirect("/registration");
//         }
//         const hashedPass = await bcrypt.hash(req.body.password, 12);
//         admin = new Admin({
//             username: req.body.username,
//             email: req.body.email,
//             password: hashedPass,
//             userType: 'isAdmin'
//         })
//         await admin.save();
//     }
//     if (userType === 'isUser') {
//         const userEmail = req.body.email;
//         let user = await User.findOne({ userEmail });
//         if (user) {
//             req.session.error = "This user already exists";
//             return res.redirect("/registration");
//         }
//         const hashedPass = await bcrypt.hash(req.body.password, 12);
//         user = new User({
//             username: req.body.username,
//             email: req.body.email,
//             password: hashedPass,
//             userType: 'isUser'
//         })
//         await user.save();
//     }
//     res.redirect("/login");
// };

exports.dashboard_get = (req, res) => {
    //create cookie for this session on the browser
    req.session.isAuth = true;
    //log session in console
    console.log("req.session", req.session);
    //log session ID in console
    console.log("SESSION ID: ", req.session.id)
    const isAdmin = req.session.userType === 'isAdmin' ? 'isAdmin' : 'isUser';
    const isAuthenticated = req.session.isLoggedIn ? req.session.isLoggedIn : false;
    const username = req.session.username;
    res.render("dashboard",
        {
            pageTitle: 'Dashboard',
            name: username,
            isAdmin: isAdmin,
            isAuthenticated: isAuthenticated
        });
};
exports.logout_post = (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect("/login");
    })
}

