const ReadingProgress = require('../models/ReadingProgress');

/**
 * POST /api/reading/progress
 */
const saveProgress = async (req, res, next) => {
  try {
    const { bookId, bookTitle, coverUrl, currentLocation, progress } = req.body;

    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: 'Book ID is required.',
      });
    }

    const data = await ReadingProgress.findOneAndUpdate(
      { userId: req.user.id, bookId },
      {
        userId: req.user.id,
        bookId,
        bookTitle: bookTitle || '',
        coverUrl: coverUrl || '',
        currentLocation: currentLocation || '',
        progress: Math.min(100, Math.max(0, progress || 0)),
        updatedAt: Date.now(),
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
 * GET /api/reading/:bookId
 */
const getProgress = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const progress = await ReadingProgress.findOne({
      userId: req.user.id,
      bookId,
    });

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/reading
 * Get all reading progress for the user
 */
const getAllProgress = async (req, res, next) => {
  try {
    const progress = await ReadingProgress.find({ userId: req.user.id })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { saveProgress, getProgress, getAllProgress };
