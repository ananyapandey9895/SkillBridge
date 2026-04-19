import { User, UserRole } from '../types';
import api from './api';

export const authService = {
  async login(email: string, password: string): Promise<string> {
    const { data } = await api.post<{ token: string }>('/auth/login', { email, password });
    return data.token;
  },

  async register(name: string, email: string, password: string, role: UserRole, learningGoals?: string): Promise<User> {
    const { data } = await api.post<{ user: User }>('/auth/register', { name, email, password, role, learningGoals });
    return data.user;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<{ user: User }>('/users/me');
    return data.user;
  },
};
