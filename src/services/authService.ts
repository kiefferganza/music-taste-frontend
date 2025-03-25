import api from './api';

export const authService = {
  async register(name: string, email: string, password: string) {
    const response = await api.post('/register', { name, email, password });
    return response.data;
  },

  async login(email: string, password: string) {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  async logout(token: string) {
    const response = await api.post('/logout');
    return response.data;
  }
};