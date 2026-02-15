import { apiClient } from './client';
import { LoginCredentials, RegisterData, User } from '@/types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User }> => {
    const { data } = await apiClient.post('/api/auth/login', credentials);
    return data;
  },

  register: async (userData: RegisterData): Promise<User> => {
    const { data } = await apiClient.post('/api/auth/register', userData);
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout');
  },

  getSession: async (): Promise<{ user: User }> => {
    const { data } = await apiClient.get('/api/auth/session');
    return data;
  },
};
