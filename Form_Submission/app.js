const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mainRoutes = require('./routes/main-routes');
const dashRoutes = require('./routes/dash-routes');
const adminRoutes = require('./routes/admin-routes');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbSession = require('connect-mongodb-session')(session);
const morgan = require('morgan')

const User = require('./models/user');
const Admin = require('./models/admin');

const { isAuth } = require("./public/js/isAuth");
// const { isLoggedIn } = require("./public/js/isLoggedIn");
const app = express();
const mongoURI = 'mongodb://localhost:27017/FormLearn';

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
//load assets
app.use(express.static(path.join(__dirname, 'public')));
//to log requests using morgan package
app.use(morgan('tiny'));

const store = new MongoDbSession({
    uri: mongoURI
});

//session middleware-fired at every single request
app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: false,
    store: store
})
);

app.use(mainRoutes);
app.use(dashRoutes);
app.use('/admin',adminRoutes);


mongoose.connect(mongoURI, () => {
    try{
        app.listen(3003, () => {
            console.log("Connected to Database");
            console.log('Started listening at port 3000.');
            
        })
    } catch (error) {
        console.log("Something went wrong with Database connection");
        process.exit(1); //Exit code 1 is for when unhandled fatal exceptions occur that was not handled by the domain
    }
});