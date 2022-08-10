const SongModel = require('../models/song');
const Category = require('../models/category');
const mongodb = require('mongodb');
//for rendering list-songs
exports.getSongs = (req, res, next) => {
    SongModel
        .find()
        // .populate('categoryId')
        .then(songs => {
            // console.log('songs', songs);
            const isAdmin = req.session.userType === 'isAdmin' ? 'isAdmin' : 'isUser';
            const isAuthenticated = req.session.isLoggedIn ? req.session.isLoggedIn : false;
            res.render('list-songs', {
                pageTitle: "My Playlist - List Songs",
                isAdmin: isAdmin,
                isAuthenticated: isAuthenticated,
                songs: songs
            });
        });
}
//show add song form/page
exports.getAddSongs = (req, res, next) => {
    Category
        .find()
        .then(categories => {
            const isAdmin = req.session.userType === 'isAdmin' ? 'isAdmin' : 'isUser';
            const isAuthenticated = req.session.isLoggedIn ? req.session.isLoggedIn : false;
            res.render('add-song', {
                pageTitle: "My Playlist-Add songs",
                isAdmin: isAdmin,
                isAuthenticated: isAuthenticated,
                categories: categories
            })
        });
}
//to save new song in db
exports.postSongs = (req, res, next) => {
    // validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    //create new song instance
    const song = new SongModel({
        _id: new mongodb.ObjectId(),
        title: req.body.name,
        artist: req.body.artist,
        imageUrl: req.body.imageUrl,
        categoryId: req.body.categoryId
    });
    //save it to data base
    song.save()
        .then(addedSong => {
            res.redirect('/admin/list-songs');
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while adding a new song" })
        });
}
exports.deleteSong = (req, res, next) => {
    const SongId = req.body.songId;

    SongModel.findByIdAndDelete(SongId)
        .then(() => {
            console.log('DESTROYED SONG');
            res.redirect('/admin/list-songs');
        })
        .catch(err => console.log(err));
};

exports.getEditSong = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/admin/list-songs');
    }
    const songId = req.params.songId
    // const songId = req.params.songId.split("&")[0];
   // const categoryId = req.params.songId.split("&")[1];
    // Category.findById(categoryId).then(categories =>{
    Category
        .find()
        .then(categories => {
            console.log('CATEGORIES --> MAIN: ', categories);
            SongModel.findById(songId)

                .then(song => {
                    if (!song) {
                        return res.redirect('/admin/list-songs');
                    }
                    const isAdmin = req.session.userType === 'isAdmin' ? 'isAdmin' : 'isUser';
                    const isAuthenticated = req.session.isLoggedIn ? req.session.isLoggedIn : false;
                    res.render('update-song', {
                        pageTitle: 'Edit Song',
                        path: '/admin/update-song',
                        isAdmin: isAdmin,
                        song: song,
                        categories: categories,
                        isAuthenticated: isAuthenticated
                    });
                })
        })
        .catch(err => console.log(err));
};

exports.postEditSong = (req, res, next) => {
    // validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    const songId = req.body.songId;

    SongModel.findByIdAndUpdate(songId, {
        title: req.body.name,
        artist: req.body.artist,
        imageUrl: req.body.imageUrl,
        categoryId: req.body.categoryId
    })
        .then(() => {

            res.redirect('/admin/list-songs');
        })
        .catch(err => console.log(err));

};
exports.adminDashboard_get = (req, res) => {
    //create cookie for this session on the browser
    req.session.isAuth = true;
    //log session in console
    console.log("req.session", req.session);
    //log session ID in console
    console.log("SESSION ID: ", req.session.id)
    const isAdmin = req.session.userType === 'isAdmin' ? 'isAdmin' : 'isUser';
    const isAuthenticated = req.session.isLoggedIn ? req.session.isLoggedIn : false;
    const username = req.session.username;
    res.render("admin-dashboard",
        {
            pageTitle: 'Admin Dashboard',
            name: username,
            isAdmin: isAdmin,
            isAuthenticated: isAuthenticated
        });
};