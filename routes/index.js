/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */

const express = require('express');

const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/', (req, res) => {
  res.redirect('/books');
});

// auth routes
router.get('/register', (req, res) => {
  res.render('index/register');
});

router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash('error', err.message);
      return res.render('index/register');
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('success', `Welcome to BookApp ${user.username}`);
      res.redirect('/books');
    });
  });
});
// login
router.get('/login', (req, res) => {
  res.render('index/login');
});
// login logic
const passportAuth = passport.authenticate('local',
  {
    successRedirect: '/books',
    failureFlash: 'You need to sign up',
    failureRedirect: '/register',
  });
router.post('/login', passportAuth, (req, res) => {
});

// logout logic
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have been logged out');
  res.redirect('/books');
});

module.exports = router;
