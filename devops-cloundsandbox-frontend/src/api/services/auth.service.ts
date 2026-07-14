import type { AuthResponse, LoginRequest, RegisterRequest} from '../../types';
import apiClient from '../client';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  // NEW: Reset Password
  resetPassword: async (data: any): Promise<void> => {
    await apiClient.post('/auth/reset-password', data);
  }
};