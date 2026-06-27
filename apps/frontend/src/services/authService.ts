import { api } from './api';
import type { LoginInput, SignUpInput, AuthResponseData, ApiResponse } from '@vedaai/shared';

export const authService = {
  async signUp(data: SignUpInput): Promise<AuthResponseData> {
    try {
      const res = await api.post<ApiResponse<AuthResponseData>>('/auth/signup', data);
      if (res.data.success) {
        return res.data.data;
      }
      throw new Error(res.data.error || 'Failed to sign up');
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to sign up');
    }
  },

  async login(data: LoginInput): Promise<AuthResponseData> {
    try {
      const res = await api.post<ApiResponse<AuthResponseData>>('/auth/login', data);
      if (res.data.success) {
        return res.data.data;
      }
      throw new Error(res.data.error || 'Failed to log in');
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to log in');
    }
  },
};
