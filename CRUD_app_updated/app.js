const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mainRoutes = require('./routes/main-routes');
const songRoutes = require('./routes/song-routes');
const categoryRoutes = require('./routes/category-routes');
const mongoose = require('mongoose');
const Category = require('./models/category');
const morgan = require('morgan')

const app = express();

//set ejs view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

//parse request to body parser
app.use(bodyParser.urlencoded({extended: false}));

//load assets
app.use(express.static(path.join(__dirname, 'public')));

//to log requests using morgan package
app.use(morgan('tiny'));
//login route
app.use('/login', (req, res, next) => {
    res.setHeader('Set-Cookie', 'isAuthenticated=true');
    res.redirect('/');
})

app.use((req, res, next) => {
    const authenticationCookie = req.headers['cookie'];
    if(authenticationCookie) {
        const isAuthenticate = authenticationCookie.split('=')[1];
        if(isAuthenticate == 'true') {
            next();
        } else {
            res.render('not-found',{
                pageTitle: 'Page not found!'
            });
        }
    } else {
        res.setHeader('Set-Cookie', 'isAuthenticated=false');
        res.render('not-found',{
            pageTitle: 'Page not found!'
        });
    }
})

app.use('/user', songRoutes);
app.use('/user', categoryRoutes);
app.use('/', mainRoutes);
app.use('/login', mainRoutes);
app.use((req, res, next) => {
    res.render('not-found', {
        pageTitle: 'Page not found!'
    });
});

mongoose.connect('mongodb://localhost:27017/playlist', () => {
    console.log("Connected to Database");
    
    // const jazzCategory = new Category({
    //     title: 'Jazz',
    //     description: 'Jazz'
    // });
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
    
    app.listen(5001, () => {
        console.log('Started listening at port 3000.');
    });
});