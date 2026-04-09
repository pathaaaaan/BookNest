import API from './axios';

export const saveProgress = (data) => API.post('/reading/progress', data);
export const getProgress = (bookId) => API.get(`/reading/${bookId}`);
export const getAllProgress = () => API.get('/reading');
