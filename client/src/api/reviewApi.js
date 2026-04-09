import API from './axios';

export const createReview = (data) => API.post('/reviews', data);
export const getBookReviews = (bookId) => API.get(`/reviews/${bookId}`);
