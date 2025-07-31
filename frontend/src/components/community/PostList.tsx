// src/components/community/PostList.tsx
import React from 'react';
import { MessageSquare } from 'lucide-react';
import type { Post } from '../../types/community.types';
import PostCard from './PostCard';
// import Spinner from '../ui/Spinner';
import { Loader2 } from 'lucide-react';

interface PostListProps {
  posts: Post[];
  loading?: boolean;
  error?: string | null;
  currentUserId?: string;
  communityId: string;
  onAuthorClick?: (authorId: string) => void;
  // Pagination props
  currentPage?: number;
  totalPages?: number;
  totalPosts?: number;
  onPageChange?: (page: number) => void;
  // Empty state customization
  emptyTitle?: string;
  emptyDescription?: string;
  showEmptyAction?: boolean;
  onEmptyAction?: () => void;
  emptyActionText?: string;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  loading = false,
  error = null,
  currentUserId,
  communityId,
  onAuthorClick,
  currentPage = 1,
  totalPages = 1,
  totalPosts = 0,
  onPageChange,
  emptyTitle = "No posts yet",
  emptyDescription = "Be the first to start a conversation in this community!",
  showEmptyAction = true,
  onEmptyAction,
  emptyActionText = "Create First Post"
}) => {

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
        <p className="text-center text-gray-500">Loading posts...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-center">
          <div className="text-red-600 mb-2">
            <MessageSquare className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Failed to load posts
          </h3>
          <p className="text-red-700">
            {error}
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!posts || posts.length === 0) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <MessageSquare className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {emptyTitle}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {emptyDescription}
          </p>
          {showEmptyAction && onEmptyAction && (
            <button
              onClick={onEmptyAction}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {emptyActionText}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Posts Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600">
          <MessageSquare className="w-5 h-5" />
          <span className="font-medium">
            {totalPosts > 0 ? `${totalPosts} posts` : `${posts.length} posts`}
          </span>
        </div>
        
        {/* Optional: Sort/Filter controls can be added here */}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            currentUserId={currentUserId}
            communityId={communityId}
            onAuthorClick={onAuthorClick}
          />
        ))}
      </div>

  {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="mt-8">
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="px-4 py-2 text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
        //   <Pagination
        //     currentPage={currentPage}
        //     totalPages={totalPages}
        //     onPageChange={onPageChange}
        //   /> 
       
export default PostList;