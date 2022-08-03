exports.defaultRoute = (req, res) => {
    res.render('index', {
        pageTitle: 'My Playlist'
    });
}
exports.loginRoute = (req, res) => {
    res.render('login', {
        pageTitle: 'My Playlist-logged In'
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
