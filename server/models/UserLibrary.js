const mongoose = require('mongoose');

const userLibrarySchema = new mongoose.Schema({
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
  authors: [{
    type: String,
  }],
  subjects: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['reading', 'completed', 'wishlist'],
    default: 'wishlist',
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

userLibrarySchema.index({ userId: 1, bookId: 1 }, { unique: true });

module.exports = mongoose.model('UserLibrary', userLibrarySchema);
