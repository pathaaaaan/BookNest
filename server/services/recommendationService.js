const natural = require('natural');
const UserLibrary = require('../models/UserLibrary');
const Book = require('../models/Book');
const openLibraryService = require('./openLibraryService');

/**
 * Content-based recommendation engine using TF-IDF + Cosine Similarity
 */
class RecommendationService {
  constructor() {
    this.tfidf = new natural.TfIdf();
  }

  /**
   * Generate recommendations for a user
   */
  async getRecommendations(userId, limit = 10) {
    try {
      // Step 1: Get user's reading history
      const userBooks = await UserLibrary.find({
        userId,
        status: { $in: ['reading', 'completed'] },
      });

      if (userBooks.length === 0) {
        // No history — return trending/popular books
        return openLibraryService.getTrendingBooks('fiction', limit);
      }

      // Step 2: Build user profile from their books
      const userProfile = this.buildUserProfile(userBooks);

      // Step 3: Get candidate books from user's favorite subjects/authors
      const candidates = await this.getCandidateBooks(userProfile, userBooks);

      if (candidates.length === 0) {
        return openLibraryService.getTrendingBooks('fiction', limit);
      }

      // Step 4: Rank candidates using TF-IDF + Cosine Similarity
      const ranked = this.rankCandidates(userProfile, candidates);

      // Step 5: Return top N
      return ranked.slice(0, limit);
    } catch (error) {
      console.error('Recommendation error:', error.message);
      // Fallback to trending
      return openLibraryService.getTrendingBooks('fiction', limit);
    }
  }

  /**
   * Build a text profile from the user's book history
   */
  buildUserProfile(userBooks) {
    const subjects = [];
    const authors = [];

    userBooks.forEach((book) => {
      if (book.subjects) subjects.push(...book.subjects);
      if (book.authors) authors.push(...book.authors);
    });

    // Count frequency to find top preferences
    const subjectCounts = this.countFrequency(subjects);
    const authorCounts = this.countFrequency(authors);

    // Get top subjects and authors
    const topSubjects = Object.entries(subjectCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([key]) => key);

    const topAuthors = Object.entries(authorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key]) => key);

    // Create text profile for TF-IDF
    const profileText = [
      ...topSubjects,
      ...topAuthors,
      ...userBooks.map((b) => b.bookTitle || ''),
    ].join(' ');

    return { topSubjects, topAuthors, profileText };
  }

  /**
   * Fetch candidate books based on user's preferences
   */
  async getCandidateBooks(userProfile, userBooks) {
    const existingBookIds = new Set(userBooks.map((b) => b.bookId));
    const candidates = [];

    // Fetch books by top subjects (limit API calls)
    const subjectsToFetch = userProfile.topSubjects.slice(0, 3);
    for (const subject of subjectsToFetch) {
      const books = await openLibraryService.getBooksBySubject(subject, 10);
      candidates.push(...books);
    }

    // Fetch books by top authors
    for (const author of userProfile.topAuthors.slice(0, 2)) {
      try {
        const result = await openLibraryService.searchBooks(author, {
          author,
          limit: 5,
        });
        candidates.push(...result.books);
      } catch (err) {
        console.error(`Author search failed for "${author}":`, err.message);
      }
    }

    // Filter out books already in user's library and deduplicate
    const seen = new Set();
    return candidates.filter((book) => {
      if (existingBookIds.has(book.olKey) || seen.has(book.olKey)) return false;
      seen.add(book.olKey);
      return true;
    });
  }

  /**
   * Rank candidates using TF-IDF cosine similarity
   */
  rankCandidates(userProfile, candidates) {
    this.tfidf = new natural.TfIdf();

    // Document 0: User profile
    this.tfidf.addDocument(userProfile.profileText);

    // Documents 1..N: Candidate books
    candidates.forEach((book) => {
      const bookText = [
        book.title || '',
        ...(book.authors || []),
        ...(book.subjects || []),
      ].join(' ');
      this.tfidf.addDocument(bookText);
    });

    // Get user profile vector
    const userVector = this.getDocumentVector(0);

    // Compute similarity for each candidate
    const scored = candidates.map((book, index) => {
      const bookVector = this.getDocumentVector(index + 1);
      const similarity = this.cosineSimilarity(userVector, bookVector);
      return { ...book, score: similarity };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    return scored;
  }

  /**
   * Extract TF-IDF vector for a document
   */
  getDocumentVector(docIndex) {
    const vector = {};
    this.tfidf.listTerms(docIndex).forEach((term) => {
      vector[term.term] = term.tfidf;
    });
    return vector;
  }

  /**
   * Compute cosine similarity between two sparse vectors
   */
  cosineSimilarity(vecA, vecB) {
    const allTerms = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
    let dotProduct = 0;
    let magA = 0;
    let magB = 0;

    allTerms.forEach((term) => {
      const a = vecA[term] || 0;
      const b = vecB[term] || 0;
      dotProduct += a * b;
      magA += a * a;
      magB += b * b;
    });

    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);

    if (magA === 0 || magB === 0) return 0;
    return dotProduct / (magA * magB);
  }

  /**
   * Count frequency of items in an array
   */
  countFrequency(arr) {
    return arr.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});
  }
}

module.exports = new RecommendationService();
