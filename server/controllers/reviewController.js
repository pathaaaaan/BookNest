const Review = require('../models/Review');

/**
 * POST /api/reviews
 */
const createReview = async (req, res, next) => {
  try {
    const { bookId, rating, comment } = req.body;

    if (!bookId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Book ID and rating are required.',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5.',
      });
    }

    const review = await Review.findOneAndUpdate(
      { userId: req.user.id, bookId },
      {
        userId: req.user.id,
        bookId,
        rating,
        comment: comment || '',
        createdAt: Date.now(),
      },
      { upsert: true, new: true }
    );

    // Populate user info
    const populated = await Review.findById(review._id).populate({
      path: 'userId',
      select: 'name avatar',
    });

    res.status(200).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/reviews/:bookId
 */
const getBookReviews = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const reviews = await Review.find({ bookId })
      .populate({ path: 'userId', select: 'name avatar' })
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalRatings = reviews.length;
    const averageRating = totalRatings > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;

    res.status(200).json({
      success: true,
      data: {
        reviews,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, getBookReviews };
