import API from './axios';

export const addToLibrary = (data) => API.post('/library/add', data);
export const getLibrary = (params) => API.get('/library', { params });
export const getBookStatus = (bookId) => API.get(`/library/status/${bookId}`);
export const removeFromLibrary = (bookId) => API.delete(`/library/${bookId}`);
