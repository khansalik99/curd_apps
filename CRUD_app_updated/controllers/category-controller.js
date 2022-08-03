const Category = require('../models/category');
const mongodb = require('mongodb');

//show add song form/page
exports.getAddCategory = (req, res, next) => {
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    Category
    .find()
    .then(categories => {
        res.render('add-category', {
            pageTitle: "My Playlist-Add Category",
            success: ""
        })
    });
}
//to save new sog in db
exports.postCategory = async (req, res, next) => {
    const CategoryNew = req.body.title;
    let CategoryTest  = await Category.findOne({title:CategoryNew}); 
    if(CategoryTest ){
        console.log("This is defined");
        res.render('add-category', {
            pageTitle: "My Playlist-Add Category",
            success: ` ${CategoryNew} category already exist`
        })
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
    
    category.save()
    .then(addedCategory => {
        res.render('add-category', {
            pageTitle: "My Playlist-New Category",
            success: `Success: ${addedCategory.title} category added`
        })
    
    })
    .catch(err => {
        res.status(500).send({ message: err.message || "Some error occurred while adding a new song" })
        });
}
