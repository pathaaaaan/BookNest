const mongoose = require('mongoose');

const readingProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
  bookTitle: {
    type: String,
    default: '',
  },
  coverUrl: {
    type: String,
    default: '',
  },
  currentLocation: {
    type: String, // epubcfi string
    default: '',
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

readingProgressSchema.index({ userId: 1, bookId: 1 }, { unique: true });

readingProgressSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ReadingProgress', readingProgressSchema);
