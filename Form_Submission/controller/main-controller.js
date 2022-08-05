const mongodb = require('mongodb');
const User = require('../models/user');
const Admin = require('../models/admin');
const { isAuth } = require("../public/js/isAuth");


exports.signinGet = (req, res, next) => {
  // console.log("Page is showing")
  res.render('signin');
};
// login page postmethod        
exports.mainPageGet = async (req, res) => {
  const userEmail = req.body.email;
  const admin = await Admin.findOne({ email: userEmail });
  console.log("admin"+admin);
  //   const admin = new Admin({
  //     username: "giggles",
  //     email: "giggles2411@gmail.com",
  //     password: "yes",
  //     userType: "admin"
  // });
  // await admin.save();
  if (admin) {
    const Adminpassword = req.body.password;
    const isAdminMatch = await Admin.find({ email: userEmail, password: Adminpassword }).count();
    console.log("isAdminMatch"+isAdminMatch);
    if (!isAdminMatch) {
      console.log("pasword doesnot match");
      return res.redirect('/');
    } else {
      req.session.username = admin.username;
      req.session.admin = admin;
      req.session.isLoggedIn = true,
      req.session.isAuth = true;
      req.session.userType = "isAdmin";
      res.redirect('/admin/dash');
    }

  } else {
    const user = await User.find({ email: userEmail }).count();
    console.log("user"+user);
    // if the user doesnot exist
    if (!user) {
      console.log("user doesnot exist");
      return res.redirect('/');
    }
    const Userpassword = req.body.password;
    const isMatch = await User.find({ email: userEmail, password: Userpassword }).count();
    console.log("isMatchr"+isMatch);

    //if password is wrong
    if (!isMatch) {
      console.log("pasword doesnot match");
      return res.redirect('/');
    }
    // console.login("succesfully logged in")
    req.session.username = user.username;
    req.session.user = user;
    req.session.isLoggedIn = true,
    req.session.isAuth = true;
    req.session.userType = "isUser";
    res.redirect('/dash');
  }



};
//-------------------------------------------------register get method------------------------------------------
exports.registerGet = (req, res, next) => {
  // console.log("Page is showing")
  res.render('register');
}
//----------------------------------------------------------register post method ---------------------------------
exports.registerPost = async (req, res) => {
  const userEmail = req.body.email;
  const user = await User.findOne({ email: userEmail }).count();
  console.log(user);
  // if the user doesnot exist
  if (user) {
    console.log("user already exists");
    return res.redirect('/register');
  }
  else {
    const user = new User({
      username: req.body.name,
      email: req.body.email,
      password: req.body.password,
      userType: "isUser"
    });
    await user.save();
    return res.redirect('/');
  }
}

