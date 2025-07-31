import api from './api';
import type { LoginRequest, RegisterRequest, AuthResponse,
  // ForgotPasswordRequest, 
  // ResetPasswordRequest, 
  // ForgotPasswordResponse, 
  // ResetPasswordResponse 
 } from '../types/auth.types';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/profile');
    // return response.data;
    return response.data.user;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  // forgotPassword: async(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> =>{
  //   const response = await api.post('/auth/forgot-password',data);
  //   return response.data;
  // },

  // resetPassword: async ( data: ResetPasswordRequest): Promise<ResetPasswordResponse> =>{
  //   const response=await api.post('/auth/reset-password', data);
  //   return response.data;
  // },
};