/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable no-console */

const express = require('express');

const router = express.Router({ mergeParams: true });
const Book = require('../models/book');
const Comment = require('../models/comment');
const middleware = require('../middleware');

// NEW
router.get('/new', middleware.isLoggedIn, (req, res) => {
  Book.findById(req.params.id, (err, book) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { book });
    }
  });
});
// CREATE
router.post('/', middleware.isLoggedIn, (req, res) => {
  Book.findById(req.params.id, (err, book) => {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          book.comments.push(comment);
          book.save();
          req.flash('success', `You just commented on ${book.title}`);
          res.redirect(`/books/${req.params.id}`);
        }
      });
    }
  });
});
// EDIT
router.get('/:comment_id/edit', middleware.checkForCommentAuthorization, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      res.redirect('back');
    } else {
      res.render('comments/edit', { book_id: req.params.id, comment: foundComment });
    }
  });
});
// UPDATE
router.put('/:comment_id', middleware.checkForCommentAuthorization, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect(`/books/${req.params.id}`);
    }
  });
});
// DELETE
router.delete('/:comment_id', middleware.checkForCommentAuthorization, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      console.log(err);
    } else {
      req.flash('success', 'Your comment has been deleted');
      res.redirect(`/books/${req.params.id}`);
    }
  });
});


module.exports = router;
