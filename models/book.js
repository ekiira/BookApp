/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  image: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
  plot: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],

});

module.exports = mongoose.model('Book', bookSchema);
