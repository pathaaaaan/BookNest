const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  olKey: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  authors: [{
    type: String,
  }],
  coverId: {
    type: Number,
  },
  firstPublishYear: {
    type: Number,
  },
  subjects: [{
    type: String,
  }],
  description: {
    type: String,
    default: '',
  },
  isbn: [{
    type: String,
  }],
  editionCount: {
    type: Number,
    default: 0,
  },
  hasFulltext: {
    type: Boolean,
    default: false,
  },
  iaIdentifiers: [{
    type: String,
  }],
  cachedAt: {
    type: Date,
    default: Date.now,
    index: { expires: 86400 }, // TTL: 24 hours
  },
});

module.exports = mongoose.model('Book', bookSchema);
