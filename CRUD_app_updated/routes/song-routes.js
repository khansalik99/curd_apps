const express = require('express');

const songController = require('../controllers/song-controller');

const router = express.Router();

//Display all songs
router.get('/list-songs', songController.getSongs);
//on click to 'Add songs' render ADD SONG page
router.get('/add-song', songController.getAddSongs);
//On submit Add new song to db
router.post('/add-song', songController.postSongs);
//On submit delete song to db
router.post('/delete-song', songController.deleteSong);

router.get('/update-song/:songId', songController.getEditSong);
// router.post('/update-product', songController.postEditSong);
router.post('/update-song', songController.postEditSong);

module.exports = router;
