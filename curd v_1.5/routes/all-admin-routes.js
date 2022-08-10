const express = require('express');

const router = express.Router();
const {isAuth} = require("../helpers/isAuth");
const {checkAdmin} = require("../routes_protection/checkAdmin");
const allAdminsController = require("../controllers/all_admins-controller");
const { newUserValidation } = require("../helpers/validation");

//Display all admins
router.get('/all-admins', isAuth, checkAdmin, allAdminsController.getAdmins);
// //on click to 'Add New Admin' render ADD ADMIN page
router.get('/add-admin', isAuth ,checkAdmin,  allAdminsController.getAdd_Admin);
// //On submit Add new admin to db
router.post('/add-admin', isAuth, checkAdmin, newUserValidation, allAdminsController.postAdd_Admin);


// //On submit delete song to db
// // router.post('/delete-song', adminController.deleteSong);
// router.post('/delete-song', isAuth, checkAdmin, adminController.deleteSong);

// router.get('/update-song/:songId', checkAdmin, isAuth, adminController.getEditSong);
// // router.post('/update-product', adminController.postEditSong);
// router.post('/update-song', isAuth, checkAdmin, adminController.postEditSong);

// //on click to 'Add songs' render ADD SONG page
// router.get('/add-category',  isAuth,checkAdmin,  categoryController.getAddCategory);
// //On submit Add new song to db
// router.post('/add-category', isAuth, checkAdmin, categoryController.postCategory);

module.exports = router;
