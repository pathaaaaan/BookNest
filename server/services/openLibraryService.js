const axios = require('axios');
const Book = require('../models/Book');

const OL_BASE = 'https://openlibrary.org';
const COVER_BASE = 'https://covers.openlibrary.org';

// Simple request queue to respect 1 req/sec rate limit
let lastRequestTime = 0;

const throttledRequest = async (url, params = {}) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < 1000) {
    await new Promise((resolve) => setTimeout(resolve, 1000 - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
  return axios.get(url, { params, timeout: 15000 });
};

/**
 * Get cover image URL from cover ID
 */
const getCoverUrl = (coverId, size = 'M') => {
  if (!coverId) return null;
  return `${COVER_BASE}/b/id/${coverId}-${size}.jpg`;
};

/**
 * Search books via Open Library
 */
const searchBooks = async (query, options = {}) => {
  const { author, year, subject, limit = 20, page = 1 } = options;

  try {
    const params = {
      q: query,
      limit,
      page,
      fields: 'key,title,author_name,cover_i,first_publish_year,subject,isbn,edition_count,has_fulltext,ia,author_key',
    };

    if (author) params.author = author;
    if (year) params.first_publish_year = year;
    if (subject) params.subject = subject;

    const response = await throttledRequest(`${OL_BASE}/search.json`, params);
    const { docs, numFound } = response.data;

    // Format and cache results
    const books = docs.map((doc) => formatBookFromSearch(doc));

    // Cache in background (don't await)
    cacheBooks(books).catch((err) => console.error('Cache error:', err.message));

    return { books, total: numFound, page };
  } catch (error) {
    console.error('Open Library search error:', error.message);
    throw new Error('Failed to search books from Open Library');
  }
};

/**
 * Get book details by Open Library key
 */
const getBookDetails = async (olKey) => {
  // Check cache first
  const cached = await Book.findOne({ olKey });
  if (cached) {
    return formatCachedBook(cached);
  }

  try {
    // Fetch work details
    const cleanKey = olKey.replace('/works/', '');
    const response = await throttledRequest(`${OL_BASE}/works/${cleanKey}.json`);
    const work = response.data;

    // Extract description
    let description = '';
    if (work.description) {
      description = typeof work.description === 'string'
        ? work.description
        : work.description.value || '';
    }

    // Fetch author names
    let authors = [];
    if (work.authors && work.authors.length > 0) {
      const authorPromises = work.authors.slice(0, 3).map(async (a) => {
        try {
          const authorKey = a.author?.key || a.key;
          if (!authorKey) return 'Unknown';
          const authorRes = await throttledRequest(`${OL_BASE}${authorKey}.json`);
          return authorRes.data.name || 'Unknown';
        } catch {
          return 'Unknown';
        }
      });
      authors = await Promise.all(authorPromises);
    }

    // Get cover and subjects
    const coverId = work.covers ? work.covers[0] : null;
    const subjects = (work.subjects || []).slice(0, 20);

    const bookData = {
      olKey: cleanKey,
      title: work.title,
      authors,
      coverId,
      firstPublishYear: work.first_publish_date
        ? parseInt(work.first_publish_date) || null
        : null,
      subjects,
      description,
      isbn: [],
      editionCount: 0,
      hasFulltext: false,
      iaIdentifiers: [],
      cachedAt: new Date(),
    };

    // Cache the book
    try {
      await Book.findOneAndUpdate(
        { olKey: cleanKey },
        bookData,
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error('Cache save error:', err.message);
    }

    return formatBookData(bookData);
  } catch (error) {
    console.error('Open Library details error:', error.message);
    throw new Error('Failed to fetch book details from Open Library');
  }
};

/**
 * Get trending/popular books
 */
const getTrendingBooks = async (subject = 'popular', limit = 20) => {
  try {
    const response = await throttledRequest(`${OL_BASE}/search.json`, {
      q: subject,
      sort: 'rating',
      limit,
      fields: 'key,title,author_name,cover_i,first_publish_year,subject,isbn,edition_count,has_fulltext,ia',
    });

    return response.data.docs.map((doc) => formatBookFromSearch(doc));
  } catch (error) {
    console.error('Trending books error:', error.message);
    return [];
  }
};

/**
 * Get books by subject for recommendations
 */
const getBooksBySubject = async (subject, limit = 10) => {
  try {
    const response = await throttledRequest(`${OL_BASE}/subjects/${encodeURIComponent(subject.toLowerCase())}.json`, {
      limit,
    });

    if (!response.data.works) return [];

    return response.data.works.map((work) => ({
      olKey: work.key.replace('/works/', ''),
      title: work.title,
      authors: work.authors ? work.authors.map((a) => a.name) : [],
      coverId: work.cover_id,
      coverUrl: getCoverUrl(work.cover_id),
      firstPublishYear: work.first_publish_year,
      subjects: [subject],
    }));
  } catch (error) {
    console.error(`Subject fetch error for "${subject}":`, error.message);
    return [];
  }
};

// ─── Helper Functions ───────────────────────────────────────────

function formatBookFromSearch(doc) {
  const olKey = doc.key ? doc.key.replace('/works/', '') : '';
  return {
    olKey,
    title: doc.title || 'Untitled',
    authors: doc.author_name || ['Unknown'],
    coverId: doc.cover_i || null,
    coverUrl: getCoverUrl(doc.cover_i),
    firstPublishYear: doc.first_publish_year || null,
    subjects: (doc.subject || []).slice(0, 10),
    isbn: (doc.isbn || []).slice(0, 5),
    editionCount: doc.edition_count || 0,
    hasFulltext: doc.has_fulltext || false,
    iaIdentifiers: doc.ia || [],
  };
}

function formatCachedBook(book) {
  return {
    olKey: book.olKey,
    title: book.title,
    authors: book.authors,
    coverId: book.coverId,
    coverUrl: getCoverUrl(book.coverId),
    firstPublishYear: book.firstPublishYear,
    subjects: book.subjects,
    description: book.description,
    isbn: book.isbn,
    editionCount: book.editionCount,
    hasFulltext: book.hasFulltext,
    iaIdentifiers: book.iaIdentifiers,
  };
}

function formatBookData(data) {
  return {
    ...data,
    coverUrl: getCoverUrl(data.coverId),
  };
}

async function cacheBooks(books) {
  const ops = books.map((book) => ({
    updateOne: {
      filter: { olKey: book.olKey },
      update: { ...book, cachedAt: new Date() },
      upsert: true,
    },
  }));
  if (ops.length > 0) {
    await Book.bulkWrite(ops, { ordered: false });
  }
}

module.exports = {
  searchBooks,
  getBookDetails,
  getTrendingBooks,
  getBooksBySubject,
  getCoverUrl,
};
