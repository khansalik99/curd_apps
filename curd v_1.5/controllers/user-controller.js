const SongModel = require('../models/song');

exports.dashboard_get = (req, res) => {
    //create cookie for this session on the browser
    req.session.isAuth = true;
    //log session in console
    console.log("req.session", req.session);
    //log session ID in console
    console.log("SESSION ID: ", req.session.id)
    SongModel
        .find()
        //.populate('categoryId')
        .then(songs => {
            // console.log('songs', songs);
            const isAdmin = req.session.userType === 'isAdmin' ? 'isAdmin' : 'isUser';
            const isAuthenticated = req.session.isLoggedIn ? req.session.isLoggedIn : false;
            const username = req.session.username;
            res.render("dashboard", {
                pageTitle: 'User Dashboard',
                isAdmin: isAdmin,
                name: username,
                isAuthenticated: isAuthenticated,
                songs: songs
            });
        });
};