const Category = require('../models/category');
const mongodb = require('mongodb');
//for rendering all categories page
exports.getAllCategories = (req, res, next) => {
    Category
        .find()
        .then(categories => {
            // console.log('songs', songs);
            const isAdmin = req.session.userType === 'isAdmin' ? 'isAdmin' : 'isUser';
            const isAuthenticated = req.session.isLoggedIn ? req.session.isLoggedIn : false;
            res.render('all-categories', {
                pageTitle: "Admin - All Categories",
                isAdmin: isAdmin,
                isAuthenticated: isAuthenticated,
                categories: categories
            });
        });
}
//show add song form/page
exports.getAddCategory = (req, res, next) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    Category
    .find()
    .then(categories => {
        const isAdmin = req.session.userType === 'isAdmin' ? 'isAdmin' : 'isUser';
        const isAuthenticated = req.session.isLoggedIn ? req.session.isLoggedIn : false;
        res.render('add-category', {
            pageTitle: "My Playlist-Add Category",
            success: "",
            isAdmin: isAdmin,
            isAuthenticated: isAuthenticated,
           
        })
    });
}
//to save new sog in db
exports.postCategory = async (req, res) => {
    let categoryName =  req.body.title;
    // const categoryName =  req.body.title;
   
    let newCategory = await Category.findOne({ title: categoryName });
    if(!newCategory){
        console.log(`${req.body.title} category doesn't exist before`);
    }
    // let newCategory = Category.findOne({ categoryName });
    if (newCategory) {
        req.session.error = "This category already exists";
        return res.redirect("/admin/add-category");
    }
    // validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    //create new song instance
    const category = new Category({
        title: req.body.title,
        description: req.body.description
    });
    //save it to data base
    await category.save()
    .then(addedCategory => {
        const isAdmin = req.session.userType === 'isAdmin' ? 'isAdmin' : 'isUser';
        const isAuthenticated = req.session.isLoggedIn ? req.session.isLoggedIn : false;
        res.render('add-category', {
            pageTitle: "My Playlist-New Category",
            isAdmin: isAdmin,
            isAuthenticated: isAuthenticated,
            success: `Success: ${addedCategory.title} category added`
        })
    
    })
    .catch(err => {
        res.status(500).send({ message: err.message || "Some error occurred while adding a new song" })
        });
}
