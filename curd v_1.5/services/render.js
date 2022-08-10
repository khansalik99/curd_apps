const { isAuth } = require("../helpers/isAuth");
const { isLoggedIn } = require("../helpers/isLoggedIn");

exports.defaultRoute = (req, res) => {
    const isAdmin = req.session.userType === 'isAdmin' ? 'isAdmin' : 'isUser';
    const isAuthenticated = req.session.isLoggedIn ? req.session.isLoggedIn : false;
    res.render('index', {
        pageTitle: 'Absolute Music-Index',
        isAdmin: isAdmin,
        isAuthenticated: isAuthenticated
    });
}

exports.listSongsRoute = (req, res) => {
    res.render('list-songs', {
        pageTitle: "My Playlist - List Songs",
    });
}

exports.addSongRoute = (req, res) => {
    res.render('add-song', {
        pageTitle: "My Playlist- Add songs",
    })
}

exports.updateSongRoute = (req, res) => {
    res.render('update-song', {
        pageTitle: "My Playlist- Update song",
    })
}
