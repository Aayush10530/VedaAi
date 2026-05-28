import { api } from './api';
import type { LoginInput, SignUpInput, AuthResponseData, ApiResponse } from '@vedaai/shared';

export const authService = {
  async signUp(data: SignUpInput): Promise<AuthResponseData> {
    const res = await api.post<ApiResponse<AuthResponseData>>('/auth/signup', data);
    if (res.data.success) {
      return res.data.data;
    }
    throw new Error(res.data.error || 'Failed to sign up');
  },

  async login(data: LoginInput): Promise<AuthResponseData> {
    const res = await api.post<ApiResponse<AuthResponseData>>('/auth/login', data);
    if (res.data.success) {
      return res.data.data;
    }
    throw new Error(res.data.error || 'Failed to log in');
  },
};
