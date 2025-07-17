import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service'

export const useUsers = () => {
  const queryClient = useQueryClient();

  // Get current user profile
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: userService.getProfile,
    enabled: !!localStorage.getItem('token'),
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: userService.changePassword,
    onSuccess: () => {
      // Optionally logout user after password change
      // or show success message
    },
  });

  // Search users
  const searchUsers = (query: string) => {
    return useQuery({
      queryKey: ['users', 'search', query],
      queryFn: () => userService.searchUsers(query),
      enabled: !!query && query.length > 2,
    });
  };

  // Get user by ID
  const getUser = (id: string) => {
    return useQuery({
      queryKey: ['user', id],
      queryFn: () => userService.getUserById(id),
      enabled: !!id,
    });
  };

  // Join community
  const joinCommunityMutation = useMutation({
    mutationFn: userService.joinCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });

  // Leave community
  const leaveCommunityMutation = useMutation({
    mutationFn: userService.leaveCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });

  return {
    profile,
    isProfileLoading,
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,
    searchUsers,
    getUser,
    joinCommunity: joinCommunityMutation.mutate,
    leaveCommunity: leaveCommunityMutation.mutate,
    updateProfileError: updateProfileMutation.error,
    changePasswordError: changePasswordMutation.error,
  };
};