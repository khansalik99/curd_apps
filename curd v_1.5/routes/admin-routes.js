const express = require('express');
const router = express.Router();
const adminController = require("../controllers/admin-controller");
const appController = require("../controllers/accounts-controller");
const { isAuth } = require("../helpers/isAuth");
const { checkAdmin } = require("../routes_protection/checkAdmin")
const categoryController = require('../controllers/category-controller');


//Dashboard Page
router.get('/admin-dashboard', isAuth, checkAdmin, adminController.adminDashboard_get);

//Display all songs
router.get('/list-songs', isAuth, checkAdmin, adminController.getSongs);
//on click to 'Add songs' render ADD SONG page
router.get('/add-song', isAuth ,checkAdmin,  adminController.getAddSongs);
//On submit Add new song to db
router.post('/add-song', isAuth, checkAdmin, adminController.postSongs);
//On submit delete song to db
// router.post('/delete-song', adminController.deleteSong);
router.post('/delete-song', isAuth, checkAdmin, adminController.deleteSong);

router.get('/update-song/:songId', checkAdmin, isAuth, adminController.getEditSong);
// router.post('/update-product', adminController.postEditSong);
router.post('/update-song', isAuth, checkAdmin, adminController.postEditSong);

//on click to 'Categories' on admin dashboard render All categories page
router.get('/all-categories', isAuth, checkAdmin, categoryController.getAllCategories);
//on click to 'Add songs' render ADD SONG page
router.get('/add-category',  isAuth,checkAdmin,  categoryController.getAddCategory);
//On submit Add new song to db
router.post('/add-category', isAuth, checkAdmin, categoryController.postCategory);


//Log Out 
router.post("/logout", isAuth,appController.logout_post);
module.exports = router;
