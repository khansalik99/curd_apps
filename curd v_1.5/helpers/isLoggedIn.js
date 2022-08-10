//middleware for route protection when logged out
const isLoggedIn = (req, res, next) => {
    if (req.session.isAuth) {
        console.log("Cannot register new user when logged In")
        res.redirect('/dashboard');
    } else {
        next();
    }
}
module.exports = {isLoggedIn};