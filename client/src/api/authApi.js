import API from './axios';

export const login = (data) => API.post('/auth/login', data);
export const signup = (data) => API.post('/auth/signup', data);
export const getMe = () => API.get('/auth/me');
