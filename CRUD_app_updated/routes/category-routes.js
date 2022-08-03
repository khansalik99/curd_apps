const express = require('express');

const categoryController = require('../controllers/category-controller');

const router = express.Router();

//on click to 'Add songs' render ADD SONG page
router.get('/add-category', categoryController.getAddCategory);
//On submit Add new song to db
router.post('/add-category', categoryController.postCategory);

module.exports = router;
