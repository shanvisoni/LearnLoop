import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
// import { LoginRequest, RegisterRequest } from '../types/auth.types';

// export const useAuth = () => {
//   const queryClient = useQueryClient();

//   // Get current user
//   const { data: user, isLoading } = useQuery({
//     queryKey: ['auth', 'user'],
//     queryFn: authService.getCurrentUser,
//     enabled: !!localStorage.getItem('token'),
//     retry: false,
//   });

//   // Login mutation
//   const loginMutation = useMutation({
//     mutationFn: authService.login,
//     onSuccess: (data) => {
//       localStorage.setItem('token', data.accessToken);
//       queryClient.setQueryData(['auth', 'user'], data.user);
//       queryClient.invalidateQueries({ queryKey: ['auth'] });
//     },
//   });

//   // Register mutation
//   const registerMutation = useMutation({
//     mutationFn: authService.register,
//     onSuccess: (data) => {
//       localStorage.setItem('token', data.accessToken);
//       queryClient.setQueryData(['auth', 'user'], data.user);
//     },
//   });

//   // Logout
//   const logout = () => {
//     localStorage.removeItem('token');
//     queryClient.clear();
//     window.location.href = '/login';
//   };

//   return {
//     user,
//     isLoading,
//     isAuthenticated: !!user,
//     login: loginMutation.mutate,
//     register: registerMutation.mutate,
//     logout,
//     isLoginLoading: loginMutation.isPending,
//     isRegisterLoading: registerMutation.isPending,
//     loginError: loginMutation.error,
//     registerError: registerMutation.error,
//   };
// };









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
    },
  });

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    queryClient.clear();
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
  };
};