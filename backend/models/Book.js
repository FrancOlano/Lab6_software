const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  available: {
    type: Boolean,
    default: true
  },
  reserved: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Book', bookSchema);
