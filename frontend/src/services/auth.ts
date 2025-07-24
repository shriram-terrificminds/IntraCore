import type { AuthResponse, User } from '../types';
import api from './api';

export const authService = {
  async login(email: string, password: string, remember: boolean): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
      remember_me: remember,
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async register(
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
    location: string
  ): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
      password_confirmation,
      location,
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  async resetPassword(
    token: string,
    email: string,
    password: string,
    password_confirmation: string
  ): Promise<void> {
    await api.post('/auth/reset-password', {
      token,
      email,
      password,
      password_confirmation,
    });
  },

  async getUser(): Promise<User> {
    const response = await api.get<{ data: User }>('/auth/user');
    return response.data.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },
}; 