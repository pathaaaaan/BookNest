const UserLibrary = require('../models/UserLibrary');

/**
 * POST /api/library/add
 */
const addToLibrary = async (req, res, next) => {
  try {
    const { bookId, bookTitle, coverUrl, authors, subjects, status } = req.body;

    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: 'Book ID is required.',
      });
    }

    const validStatuses = ['reading', 'completed', 'wishlist'];
    const bookStatus = validStatuses.includes(status) ? status : 'wishlist';

    const data = await UserLibrary.findOneAndUpdate(
      { userId: req.user.id, bookId },
      {
        userId: req.user.id,
        bookId,
        bookTitle: bookTitle || '',
        coverUrl: coverUrl || '',
        authors: authors || [],
        subjects: subjects || [],
        status: bookStatus,
        addedAt: Date.now(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/library?status=reading|completed|wishlist
 */
const getLibrary = async (req, res, next) => {
  try {
    const filter = { userId: req.user.id };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const books = await UserLibrary.find(filter).sort({ addedAt: -1 });

    res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/library/:bookId
 */
const removeFromLibrary = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    await UserLibrary.findOneAndDelete({
      userId: req.user.id,
      bookId,
    });

    res.status(200).json({
      success: true,
      message: 'Book removed from library.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/library/status/:bookId
 */
const getBookStatus = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const entry = await UserLibrary.findOne({
      userId: req.user.id,
      bookId,
    });

    res.status(200).json({
      success: true,
      data: entry,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addToLibrary, getLibrary, removeFromLibrary, getBookStatus };
