/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

const express = require('express');

const router = express.Router();
const expressSanitizer = require('express-sanitizer');
const Book = require('../models/book');
const middleware = require('../middleware');

router.use(expressSanitizer());
// index
router.get('/', (req, res) => {
  Book.find({}, (err, books) => {
    if (err) {
      console.log(err);
    } else {
      res.render('books/index', { books });
    }
  });
});
// new
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('books/new');
});
// create
router.post('/', middleware.isLoggedIn, (req, res) => {
  // req.body.book.plot = req.sanitize(req.body.book.plot);
  const { title } = req.body;
  const { image } = req.body;
  const { plot } = req.body;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  const newBook = {
    title, image, plot, author,
  };
  Book.create(newBook, (err, newBook) => {
    if (err) {
      console.log(err);
    } else {
      req.flash('success', 'You have added a new book');
      res.redirect('/books');
    }
  });
});
// show
router.get('/:id', (req, res) => {
  Book.findById(req.params.id).populate('comments').exec((err, foundBook) => {
    if (err) {
      console.log(err);
    } else {
      res.render('books/show', { book: foundBook });
    }
  });
});
// edit
router.get('/:id/edit', middleware.checkForBookAuthorization, (req, res) => {
  Book.findById(req.params.id, (err, foundBook) => {
    res.render('books/edit', { book: foundBook });
  });
});
// update
router.put('/:id', middleware.checkForBookAuthorization, (req, res) => {
  Book.findByIdAndUpdate(req.params.id, req.body.book, (err, updatedBook) => {
    if (err) {
      console.log(err);
      res.redirect('/books');
    } else {
      req.flash('success', 'You have updated your book');
      res.redirect(`/books/${req.params.id}`);
    }
  });
});
// delete
router.delete('/:id', middleware.checkForBookAuthorization, (req, res) => {
  Book.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/books');
    } else {
      req.flash('success', 'You have successfully deleted your book');
      res.redirect('/books');
    }
  });
});


module.exports = router;
