import API from './axios';

export const searchBooks = (params) => API.get('/books/search', { params });
export const getTrendingBooks = (params) => API.get('/books/trending', { params });
export const getBookById = (id) => API.get(`/books/${id}`);
