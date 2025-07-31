// src/components/community/PostCard.tsx
import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  MoreVertical, 
  Trash2, 
  Edit3,
  Clock,
  User
} from 'lucide-react';
import type { Post } from '../../types/community.types';
import { useToggleLike, useDeletePost } from '../../hooks/useCommunities';
import {Card} from '../ui/card';
import {Button} from '../ui/button';
import CommentSection from './CommentSection';

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  communityId: string;
  onAuthorClick?: (authorId: string) => void;
  showComments?: boolean;
  expandedByDefault?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUserId,
  onAuthorClick,
  showComments = true,
  expandedByDefault = false
}) => {
  const [showCommentsSection, setShowCommentsSection] = useState(expandedByDefault);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleLikeMutation = useToggleLike();
  const deletePostMutation = useDeletePost();

  const isAuthor = currentUserId === post.authorId._id;
  const isLiked = currentUserId ? post.likes.includes(currentUserId) : false;
  const likeCount = post.likes.length;
  const commentCount = post.comments.length;

  const handleLike = async () => {
    if (!currentUserId) return;
    
    try {
      await toggleLikeMutation.mutateAsync(post._id);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePostMutation.mutateAsync(post._id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleAuthorClick = () => {
    onAuthorClick?.(post.authorId._id);
  };

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return postDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: postDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Author Avatar */}
          <div 
            className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors"
            onClick={handleAuthorClick}
          >
            {post.authorId.avatar ? (
              <img 
                src={post.authorId.avatar} 
                alt={`${post.authorId.firstName} ${post.authorId.lastName}`}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>

          {/* Author Info */}
          <div>
            <button
              onClick={handleAuthorClick}
              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {post.authorId.firstName} {post.authorId.lastName}
            </button>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Post Menu */}
        {isAuthor && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <Edit3 className="w-4 h-4" />
                  Edit Post
                </button>
                <button 
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {post.title}
        </h3>
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </div>

      {/* Post Actions */}
      <div className="flex items-center gap-6 py-3 border-t border-gray-100">
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={!currentUserId || toggleLikeMutation.isPending}
          className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
            isLiked
              ? 'text-red-600 bg-red-50 hover:bg-red-100'
              : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
          } ${!currentUserId ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">{likeCount}</span>
        </button>

        {/* Comment Button */}
        {showComments && (
          <button
            onClick={() => setShowCommentsSection(!showCommentsSection)}
            className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{commentCount}</span>
          </button>
        )}
      </div>

      {/* Comments Section */}
      {showComments && showCommentsSection && (
        <div className="border-t border-gray-100 pt-4">
          <CommentSection
            postId={post._id}
            comments={post.comments}
            currentUserId={currentUserId}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Post
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deletePostMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deletePostMutation.isPending}
              >
                {deletePostMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Click Outside Menu Handler */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </Card>
  );
};

export default PostCard;