const mongodb = require('mongodb');

exports.showPage = (req, res, next) => {
           // console.log(" showing")
            res.render('dash');
        };
exports.logout = (req, res) => {
    // req.session.isAuth =false;
    // console.login(req.session.isAuth);
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect("/");
    })
}