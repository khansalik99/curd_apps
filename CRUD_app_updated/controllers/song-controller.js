const SongModel = require('../models/song');
const Category = require('../models/category');
const mongodb = require('mongodb');
//for list-songs
exports.getSongs = (req, res, next) => {
    SongModel
    .find()
    .populate('categoryId')
    .then(songs => {
        // console.log('songs', songs);
        res.render('list-songs', {
            pageTitle: "My Playlist - List Songs",
            songs: songs
        });
    });
}
//show add song form/page
exports.getAddSongs = (req, res, next) => {
    Category
    .find()
    .then(categories => {
        res.render('add-song', {
            pageTitle: "My Playlist-Add songs",
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
        res.redirect('/user/list-songs');
    })
    .catch(err => {
        res.status(500).send({ message: err.message || "Some error occurred while adding a new song" })
        });
}
exports.deleteSong =  (req, res, next) => {
    const SongId = req.body.songId;
    console.log("songId", SongId);
    SongModel.findByIdAndDelete(SongId)
      .then(() => {
        console.log('DESTROYED SONG');
        res.redirect('/user/list-songs');
      })
      .catch(err => console.log(err));
    //res.redirect('/user/list-songs');
  };

exports.getEditSong= (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect('/user/list-songs');
    }
    const songId = req.params.songId.split("&")[0];
    const categoryId = req.params.songId.split("&")[1];
    console.log("songId", songId);
    console.log("categoryId", categoryId);

    // Category.findById(categoryId).then(categories =>{
        Category
        .find()
        .then(categories =>{
        console.log('CATEGORIES --> MAIN: ', categories);
        SongModel.findById(songId)
        
        .then(song => {
            if (!song) {
                return res.redirect('/');
            }
        console.log('CATEGORIES --> Nested: ', categories);
        console.log('SONG --> Nested: ', song);
          res.render('update-song', {
          pageTitle: 'Edit Song',
          path: '/user/update-song',
          editing: editMode,
          song: song,
          categories: categories
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
     console.log("songId in post",songId)

     SongModel.findByIdAndUpdate(songId, {
        title: req.body.name,
        artist: req.body.artist,
        imageUrl: req.body.imageUrl,
        categoryId: req.body.categoryId
    })
      .then(() => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/user/list-songs');
      })
      .catch(err => console.log(err));
   
  };