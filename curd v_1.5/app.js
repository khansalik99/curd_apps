const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongodb = require('mongodb');
//all routes
const mainRoutes = require('./routes/main-routes');
const userRoutes = require('./routes/user-routes');
const adminRoutes = require('./routes/admin-routes');
const allAdminRoutes = require('./routes/all-admin-routes');
const adminUserRoutes = require('./routes/all-user-routes');

const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbSession = require('connect-mongodb-session')(session);
const morgan = require('morgan')
const { isAuth } = require("./helpers/isAuth");
const Admin = require('./models/admin');
const Category = require('./models/category');
const Song = require('./models/song');

const app = express();
const mongoURI = 'mongodb://localhost:27017/playlist';
//set ejs view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

//parse request to body parser
app.use(bodyParser.urlencoded({ extended: false }));

//load assets
app.use(express.static(path.join(__dirname, 'public')));

//to log requests using morgan package
//app.use(morgan('tiny'));
//connect sessions to mongoDB
const store = new MongoDbSession({
    uri: mongoURI
});

//session middleware-fired at every single request
app.use(session({
    secret: 'Session signature',
    resave: false,
    saveUninitialized: false,
    store: store
})
);

app.use(mainRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/admin-controls', allAdminRoutes);
app.use('/admin-controls', adminUserRoutes);

app.use((req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated ? req.session.isAuthenticated : false;
    res.render('not-found', {
        pageTitle: 'Page not found!',
        isAuth: isAuth,
        isAuthenticated: isAuthenticated
    });
});

mongoose.connect(mongoURI, async () => {
    //seeding an initial admin account
    const password = "admin123";
    const hashedPass = await bcrypt.hash(password, 12);
    let rootAdmin = await Admin.findOne({ email: "ali@gmail.com" });
    if (!rootAdmin) {
        const adminRoot = new Admin({
            username: 'ali',
            email: 'ali@gmail.com',
            password: hashedPass,
            userType: "isAdmin"
        });
        adminRoot.save();
    }
    //seeding an initial Category
    let rootCategory = await Category.findOne({ title: "Jazz" });
    if (!rootCategory) {
        const jazz = new Category({
            title: 'Jazz',
            description: 'Jazz Songs'
        });
        jazz.save();
    }
    //seeding initial song
    let rootSong = await Song.findOne({ title: "Night Changes" });
    if (!rootSong) {
        const song = new Song({
            _id: new mongodb.ObjectId(),
            title: "Night Changes",
            artist: "One Direction",
            imageUrl: "https://youtu.be/syFZfO_wfMQ",
            categoryId: "Jazz"
        });
        song.save();
    }
    try {
        app.listen(3000, () => {
            console.log("Connected to Database");
            console.log('Started listening at port 3000.');

        })
    } catch (error) {
        console.log("Something went wrong with Database connection");
        process.exit(1); //Exit code 1 is for when unhandled fatal exceptions occur that was not handled by the domain
    }
});


// jazzCategory.save();
// const popCategory = new Category({
//     title: 'Pop',
//     description: 'Pop'
// });
// popCategory.save();
// const metalCategory = new Category({
//     title: 'Metal',
//     description: 'Metal'
// });
// metalCategory.save();