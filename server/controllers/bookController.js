const openLibraryService = require('../services/openLibraryService');

/**
 * GET /api/books/search?q=&author=&year=&subject=&page=&limit=
 */
const searchBooks = async (req, res, next) => {
  try {
    const { q, author, year, subject, page, limit } = req.query;

    if (!q && !author && !subject) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query, author, or subject.',
      });
    }

    const result = await openLibraryService.searchBooks(q || '', {
      author,
      year,
      subject,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/books/trending
 */
const getTrendingBooks = async (req, res, next) => {
  try {
    const { subject = 'popular', limit = 20 } = req.query;
    const books = await openLibraryService.getTrendingBooks(subject, parseInt(limit));

    res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/books/:id
 */
const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await openLibraryService.getBookDetails(id);

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { searchBooks, getTrendingBooks, getBookById };
