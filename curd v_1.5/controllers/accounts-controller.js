const User = require('../models/user');
const Admin = require('../models/admin');
const bcrypt = require("bcryptjs");

const { validationResult } = require('express-validator');
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    };
    if (admin) {
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            req.session.error = "Invalid Admin Password";
            console.log("Invalid Password")
            return res.redirect('/login');
        }
        req.session.username = admin.username;
        req.session.admin = admin;
        req.session.isLoggedIn = true,
            req.session.isAuth = true;
        req.session.userType = "isAdmin";
        res.redirect("/admin/admin-dashboard");
    }

    else if (user) {
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
        res.redirect("/user/dashboard");
    }
    if (!user && !admin) {
        const msg =[{
            error:"Invalid Email",
            Details:"There is no user which such email"
        }];
        req.session.error = "Invalid email";
        console.log("No User Found")
        return res.status(422).json(  msg );
       // return res.redirect('/login');
    }

}
exports.registration_get = (req, res) => {
    const isAuthenticated = req.session.isLoggedIn ? req.session.isLoggedIn : false;

    console.log("registration_get -->isAuthenticated: ", isAuthenticated)
    res.render('registration', {
        pageTitle: 'Registration',
        isAuthenticated: isAuthenticated
    });
}
exports.registration_post = async (req, res) => {
    const userEmail = req.body.email;
    let user = await User.findOne({ email: userEmail });
    let admin = await Admin.findOne({ email: userEmail });
    let repeatPassMatch;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    if (user || admin) {
        req.session.error = "This user already exists";
        console.log("This user already exists");
        const msg=[{
            error:"Email not available",
            Detail:"Email is registered already"
        }]
        return res.status(422).json({ msg });
        // return res.redirect("/registration");
    }
    if (req.body.password === req.body.repeatPassword) {
        repeatPassMatch = true;
    } else {
        repeatPassMatch = false;
    }

    if (repeatPassMatch === true) {
        const hashedPass = await bcrypt.hash(req.body.password, 12);
        user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
            userType: 'isUser'
        })
        await user.save();
        res.redirect("/login");
    } else {
        res.redirect("/registration");
    }
};
exports.resetPass_get = (req, res) => {
    const isAuthenticated = req.session.isLoggedIn ? req.session.isLoggedIn : false;
    const isAdmin = req.session.userType === 'isAdmin' ? 'isAdmin' : 'isUser';
    const error = req.session.error;
    delete req.session.error;
    console.log("resetPass_get-->isAuthenticated: ", isAuthenticated)
    res.render('reset-password', {
        pageTitle: 'Reset Password',
        isAdmin: isAdmin,
        isAuthenticated: isAuthenticated,
        err: error
    });
}
exports.resetPass_post = async (req, res) => {
    const { email, newPassword, repeatPassword } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    if (newPassword === repeatPassword) {
        repeatPassMatch = true;
    } else {
        repeatPassMatch = false;
    }
    if (repeatPassMatch === true) {
        const hashedPass = await bcrypt.hash(newPassword, 12);

        const user = await User.findOneAndUpdate(email,
            { password: hashedPass },
            { new: true }
        );
        const admin = await Admin.findOneAndUpdate(email,
            { password: hashedPass },
            { new: true }
        );
        console.log("Password has been reset");
        res.redirect("/login");
    } else {
        console.log("Passwords don't match")
        res.redirect("/reset-password");
    };
}

exports.logout_post = (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect("/login");
    })
}

