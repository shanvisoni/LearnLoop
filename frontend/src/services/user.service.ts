import api from "./api";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
  };
  joinedCommunities: any[];
  createdCommunities: any[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  // Get current user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await api.put('/users/password', data);
  },

  // Search users
  searchUsers: async (query: string, limit?: number): Promise<UserProfile[]> => {
    const response = await api.get(`/users/search?q=${query}${limit ? `&limit=${limit}` : ''}`);
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string): Promise<UserProfile> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Join community
  joinCommunity: async (communityId: string): Promise<void> => {
    await api.post(`/users/communities/${communityId}/join`);
  },

  // Leave community
  leaveCommunity: async (communityId: string): Promise<void> => {
    await api.delete(`/users/communities/${communityId}/leave`);
  },
};