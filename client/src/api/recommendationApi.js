import API from './axios';

export const getRecommendations = (params) => API.get('/recommendations', { params });
