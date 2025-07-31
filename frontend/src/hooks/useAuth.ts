import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import toast from 'react-hot-toast';
import type { AuthError } from '@/types/auth.types';

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Get current user
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: authService.getCurrentUser,
    enabled: !!localStorage.getItem('token'),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.accessToken);
      queryClient.setQueryData(['auth', 'user'], data.user);
      // Force refetch after successful login
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
       toast.success(data.message || 'Login successful!');
    },
    onError: (error: any) => {
      const errorData = error?.response?.data as AuthError;
      if (errorData?.message) {
        toast.error(errorData.message);
      } else {
        toast.error('Login failed. Please try again.');
      }
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      localStorage.setItem('token', data.accessToken);
      queryClient.setQueryData(['auth', 'user'], data.user);
      // Force refetch after successful register
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
        toast.success(data.message || 'Registration successful!');
    },
     onError: (error: any) => {
      const errorData = error?.response?.data as AuthError;
      if (errorData?.message) {
        toast.error(errorData.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    },
  });

  // const forgotPasswordMutation = useMutation({
  //   mutationFn: authService.forgotPassword,
  // });
  
  // const resetPasswordMutation= useMutation({
  //   mutationFn: authService.resetPassword,
  // });

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    queryClient.clear();
    toast.success('Logged out successfully!');
    window.location.href = '/login';
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!localStorage.getItem('token'),
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,

    // forgotPassword: forgotPasswordMutation.mutate,
    // resetPassword: resetPasswordMutation.mutate,
    // isForgotPasswordLoading: forgotPasswordMutation.isPending,
    // isResetPasswordLoading: resetPasswordMutation.isPending,
    // forgotPasswordError: forgotPasswordMutation.error,
    // resetPasswordError: resetPasswordMutation.error,
    // forgotPasswordSuccess: forgotPasswordMutation.isSuccess,
    // resetPasswordSuccess: resetPasswordMutation.isSuccess,
  };
};