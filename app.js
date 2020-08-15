/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */

const express = require('express');

const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');
const methodOverride = require('method-override');
const passport = require('passport');
const localStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const dotenv = require('dotenv');
const User = require('./models/user');
const Book = require('./models/book');
const Comment = require('./models/comment');

// requiring routes
const indexRoutes = require('./routes/index');
const bookRoutes = require('./routes/books');
const commentRoutes = require('./routes/comments');

dotenv.config();

// DATABASE CONNECTION
// const dbPassword = process.env.DBPW;
const dbPassword = 'o5EwRQBpWRieg6YD';
const uri = `mongodb+srv://Jay:${dbPassword}@cluster0.mxsic.mongodb.net/Books?retryWrites=true&w=majority`;

mongoose.connect(uri, 
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
  console.log('connected to database successfully');
});


// mongoose.connect('mongodb://localhost/book_app', { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.set('useFindAndModify', false);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(express.static(`${__dirname}/public`));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret: 'Best year of my life',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// quicker way to allow the var to be on all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexRoutes);
app.use('/books', bookRoutes);
app.use('/books/:id/comments', commentRoutes);


app.listen(3000, () => {
  console.log('Server has started');
});

