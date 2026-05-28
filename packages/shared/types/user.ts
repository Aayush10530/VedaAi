import { User } from './auth';
import { ApiSuccessResponse } from './api';

export interface AuthResponseData {
  user: User;
  token: string;
}

export type AuthResponse = ApiSuccessResponse<AuthResponseData>;
