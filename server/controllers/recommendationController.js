const recommendationService = require('../services/recommendationService');

/**
 * GET /api/recommendations
 */
const getRecommendations = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const recommendations = await recommendationService.getRecommendations(
      req.user.id,
      limit
    );

    res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations };
