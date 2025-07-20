import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient,keepPreviousData  } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { communityService } from '../services/community.service';
import { postService } from '../services/post.service';
import type{
  Community,
  CreateCommunityDto,
  UpdateCommunityDto,
  CommunityResponse,
  CreatePostDto,
  CreateCommentDto
} from '../types/community.types';
import React from 'react';


// export const useCreateCommunity = () => {
// const queryClient = useQueryClient();

// return useMutation({
//     mutationFn:(data:CreateCommunityDto) => communityService.createCommunity(data),
//     onSuccess:()=>{
//         queryClient.invalidateQueries({ queryKey: ['communities'] });
//         queryClient.invalidateQueries({ queryKey:['myCreatedCommunities'] });
//         toast.success('Community created successfully!');
//     },
//     onError:(error:any)=>{
//         toast.error(error?.response?.data?.message || 'Failed to create community');
//     },
// });
// };

export const useCreateCommunity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCommunityDto) => {
      console.log('Mutation called with data:', data);
      return communityService.createCommunity(data);
    },
    onSuccess: (data, variables) => {
      console.log('Community created successfully:', data);
      console.log('Variables used:', variables);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['myCreatedCommunities'] });
      
      toast.success('Community created successfully!');
    },
    onError: (error: any, variables) => {
      console.error('Community creation failed:', error);
      console.error('Variables used:', variables);
      console.error('Error response:', error?.response);
      
      // Extract error message
      let errorMessage = 'Failed to create community';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    },
    onMutate: (variables) => {
      console.log('Mutation starting with variables:', variables);
    }
  });
};

export const useAllCommunities = (search?: string, page: number = 1, limit: number = 10) => {
  return useQuery<CommunityResponse>({
    queryKey: ['communities', search, page, limit],
    queryFn: () => communityService.getAllCommunities(search, page, limit),
    placeholderData: keepPreviousData,
  });
};

export const useCommunityById = (id:string) =>{
    return useQuery<Community>({
        queryKey:['community',id],
        queryFn:()=> communityService.getCommunityById(id),
        enabled: !!id,
    })
};

export const useUpdateCommunity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCommunityDto }) =>
      communityService.updateCommunity(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['community', data._id] });
      queryClient.invalidateQueries({ queryKey: ['myCreatedCommunities'] });
      toast.success('Community updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update community');
    },
  });
};

export const useDeleteCommunity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => communityService.deleteCommunity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['myCreatedCommunities'] });
      toast.success('Community deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete community');
    },
  });
};

// My Communities hooks
export const useMyCreatedCommunities = () => {
  return useQuery<Community[]>({
    queryKey: ['myCreatedCommunities'],
    queryFn: () => communityService.getMyCreatedCommunities(),
  });
};

export const useJoinedCommunities = () => {
  return useQuery<Community[]>({
    queryKey: ['joinedCommunities'],
    queryFn: () => communityService.getJoinedCommunities(),
  });
};

// Join/Leave Community hooks
export const useJoinCommunity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => communityService.joinCommunity(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['community', data._id] });
      queryClient.invalidateQueries({ queryKey: ['joinedCommunities'] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      toast.success('Joined community successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to join community');
    },
  });
};

export const useLeaveCommunity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => communityService.leaveCommunity(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['community', data._id] });
      queryClient.invalidateQueries({ queryKey: ['joinedCommunities'] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      toast.success('Left community successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to leave community');
    },
  });
};

// Post hooks
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePostDto) => postService.createPost(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ['communityPosts', data.communityId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['community', data.communityId] 
      });
      toast.success('Post created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create post');
    },
  });
};

export const useCommunityPosts = (communityId: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['communityPosts', communityId, page, limit],
    queryFn: () => postService.getPostsByCommunity(communityId, page, limit),
    enabled: !!communityId,
   placeholderData: keepPreviousData,
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postId: string) => postService.toggleLike(postId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ['communityPosts', data.communityId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['post', data._id] 
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to toggle like');
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: CreateCommentDto }) =>
      postService.addComment(postId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ['communityPosts', data.communityId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['post', data._id] 
      });
      toast.success('Comment added successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to add comment');
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postId: string) => postService.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
      toast.success('Post deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete post');
    },
  });
};

// Community Members hook
export const useCommunityMembers = (communityId: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['communityMembers', communityId, page, limit],
    queryFn: () => communityService.getCommunityMembers(communityId, page, limit),
    enabled: !!communityId,
   placeholderData: keepPreviousData,
  });
};

// Search hook
export const useCommunitiesSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, error } = useAllCommunities(debouncedQuery);

  return {
    searchQuery,
    setSearchQuery,
    communities: data?.communities || [],
    total: data?.total || 0,
    isLoading,
    error,
  };
};

export const useCommunitiesWithFilters = (filters: {
  searchQuery: string;
  tags: string[];
  includePrivate: boolean;
  page: number;
  limit: number;
}) => {
  const [debouncedQuery, setDebouncedQuery] = useState(filters.searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(filters.searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.searchQuery]);

  const { data, isLoading, error } = useAllCommunities(
    debouncedQuery, 
    filters.page, 
    filters.limit
  );

  // Apply client-side filtering for tags and privacy
  const filteredCommunities = React.useMemo(() => {
    if (!data?.communities) return [];

    let filtered = data.communities;

    // Filter by tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter(community => 
        community.tags?.some(tag => 
          filters.tags.some(selectedTag => 
            tag.toLowerCase().includes(selectedTag.toLowerCase())
          )
        )
      );
    }

    // Filter by privacy setting
    if (!filters.includePrivate) {
      filtered = filtered.filter(community => !community.isPrivate);
    }

    return filtered;
  }, [data?.communities, filters.tags, filters.includePrivate]);

  return {
    communities: filteredCommunities,
    total: filteredCommunities.length,
    isLoading,
    error,
  };
};

export const useCommunityStats = (communityId: string) => {
  return useQuery({
    queryKey: ['communityStats', communityId],
    queryFn: () => communityService.getCommunityStats(communityId),
    enabled: !!communityId,
  });
};