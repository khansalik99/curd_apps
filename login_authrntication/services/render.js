const { isAuth } = require("../public/js/isAuth");
const { isLoggedIn } = require("../public/js/isLoggedIn");

exports.defaultRoute = (req, res) => {
    const isAuthenticated = req.session.isLoggedIn ? req.session.isLoggedIn : false;
    res.render('index', {
        pageTitle: 'Absolute Music-Index',
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
