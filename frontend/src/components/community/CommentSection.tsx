// src/components/community/CommentSection.tsx
import React, { useState } from 'react';
import { 
  Send, 
  User, 
  Clock, 
  Trash2, 
  MessageCircle 
} from 'lucide-react';
import type { Comment } from '../../types/community.types';
import { useAddComment } from '../../hooks/useCommunities';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  currentUserId?: string;
  maxHeight?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments,
  currentUserId,
  maxHeight = "400px"
}) => {
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  
  const addCommentMutation = useAddComment();

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return commentDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: commentDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !currentUserId) {
      return;
    }

    try {
      await addCommentMutation.mutateAsync({
        postId,
        data: { content: newComment.trim() }
      });
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const displayComments = showAllComments ? comments : comments.slice(0, 3);
  const hasMoreComments = comments.length > 3;

  return (
    <div className="space-y-4">
      {/* Comments Header */}
      {comments.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MessageCircle className="w-4 h-4" />
            <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
          </div>
          
          {hasMoreComments && (
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {showAllComments ? 'Show less' : `View all ${comments.length} comments`}
            </button>
          )}
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 && (
        <div 
          className="space-y-3"
          style={{ 
            maxHeight: showAllComments ? maxHeight : 'none',
            overflowY: showAllComments ? 'auto' : 'visible'
          }}
        >
          {displayComments.map((comment) => (
            <div key={comment._id} className="flex gap-3 bg-gray-50 rounded-lg p-3">
              {/* Comment Author Avatar */}
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                {comment.authorId.avatar ? (
                  <img 
                    src={comment.authorId.avatar} 
                    alt={`${comment.authorId.firstName} ${comment.authorId.lastName}`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                {/* Comment Header */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-900">
                      {comment.authorId.firstName} {comment.authorId.lastName}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(comment.createdAt)}</span>
                    </div>
                  </div>

                  {/* Delete button for comment author */}
                  {currentUserId === comment.authorId._id && (
                    <button 
                      className="text-gray-400 hover:text-red-500 p-1"
                      title="Delete comment"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Comment Content */}
                <p className="text-sm text-gray-700 break-words">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment Form */}
      {currentUserId ? (
        <form onSubmit={handleSubmitComment} className="flex gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          
          <div className="flex-1 flex gap-2">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1"
              disabled={addCommentMutation.isPending}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!newComment.trim() || addCommentMutation.isPending}
              className="px-3"
            >
              {addCommentMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Please log in to comment on this post
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;