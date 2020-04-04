/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */

const Book = require('../models/book');
const Comment = require('../models/comment');

const middlewareObj = {};

// AUTHORIZATION
middlewareObj.checkForBookAuthorization = (req, res, next) => {
  if (req.isAuthenticated()) {
    Book.findById(req.params.id, (err, foundBook) => {
      if (err) {
        req.flash('error', 'Book not found');
        res.redirect('back');
      } else if (foundBook.author.id.equals(req.user._id)) {
        next();
      } else {
        req.flash('error', "You don't have permission to do that");
        res.redirect('back');
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

middlewareObj.checkForCommentAuthorization = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        req.flash('error', 'Comment does not exists');
        res.redirect('back');
      } else if (foundComment.author.id.equals(req.user._id)) {
        next();
      } else {
        req.flash('error', "You don't have permission to do that");
        res.redirect('back');
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};
// LOGIN RESTRICTION
middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/login');
  }
};

module.exports = middlewareObj;
