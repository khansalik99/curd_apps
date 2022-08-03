//middleware for route protection when logged out
const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next()
    } else {
        res.redirect('/login');
    }
}

module.exports = {isAuth};