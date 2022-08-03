const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mainRoutes = require('./routes/main-routes');
const adminRoutes = require('./routes/admin-routes');
// // const songRoutes = require('./routes/song-routes');
// const categoryRoutes = require('./routes/category-routes');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbSession = require('connect-mongodb-session')(session);
const morgan = require('morgan')
const { isAuth } = require("./public/js/isAuth");
const { isLoggedIn } = require("./public/js/isLoggedIn");
const Admin = require('./models/admin');
const app = express();
const mongoURI = 'mongodb://localhost:27017/playlist';
//set ejs view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

//parse request to body parser
app.use(bodyParser.urlencoded({extended: false}));

//load assets
app.use(express.static(path.join(__dirname, 'public')));

//to log requests using morgan package
app.use(morgan('tiny'));
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
app.use('/admin', adminRoutes);
// app.use('/user', songRoutes);
//                                                                                      
// app.use('/login', mainRoutes);
app.use((req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated ? req.session.isAuthenticated : false;
    res.render('not-found', {
        pageTitle: 'Page not found!',
        isAuth: isAuth,
        isAuthenticated: isAuthenticated
    });
});

mongoose.connect(mongoURI, () => {
    // const adminRoot = new Admin({
    //     username: 'ali',
    //     email: 'ali@gmail.com',
    //     password: 'ali',
    //     userType: "isAdmin"
    // });
    // adminRoot.save();
    try{
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