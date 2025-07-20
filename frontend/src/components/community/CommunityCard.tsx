import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useJoinCommunity, useLeaveCommunity } from '../../hooks/useCommunities';
import type { Community } from '../../types/community.types';

interface CommunityCardProps {
  community: Community;
  isJoined?: boolean;
  onJoin?: (communityId: string) => void;
  onLeave?: (communityId: string) => void;
  showActions?: boolean;
  currentUserId?: string;
}

const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  isJoined = false,
  onJoin,
  onLeave,
  showActions = true,
  currentUserId
}) => {
  const joinMutation = useJoinCommunity();
  const leaveMutation = useLeaveCommunity();

  const handleJoinLeave = () => {
    if (isJoined) {
      leaveMutation.mutate(community._id);
      onLeave?.(community._id);
    } else {
      joinMutation.mutate(community._id);
      onJoin?.(community._id);
    }
  };

  const isCreator = currentUserId === community.creatorId._id;
  const memberCount = community.members?.length || 0;
  const postCount = community.posts?.length || 0;

  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {community.name}
            </h3>
            <p className="text-sm text-gray-600">
              Created by {community.creatorId.firstName} {community.creatorId.lastName}
            </p>
          </div>
          {community.isPrivate && (
            <Badge variant="secondary" className="ml-2">
              Private
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 flex-1 line-clamp-3">
          {community.description}
        </p>

        {/* Tags */}
        {community.tags && community.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {community.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {community.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{community.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{memberCount} members</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7" />
            </svg>
            <span>{postCount} posts</span>
          </div>
        </div>

        {/* Actions */}
        {showActions && !isCreator && (
          <div className="flex gap-2 mt-auto">
            <Button
              onClick={handleJoinLeave}
              disabled={joinMutation.isPending || leaveMutation.isPending}
              variant={isJoined ? "outline" : "default"}
              className="flex-1"
            >
              {joinMutation.isPending || leaveMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {isJoined ? 'Leaving...' : 'Joining...'}
                </div>
              ) : (
                isJoined ? 'Leave' : 'Join'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Navigate to community details
                window.location.href = `/communities/${community._id}`;
              }}
            >
              View
            </Button>
          </div>
        )}

        {/* Creator actions */}
        {showActions && isCreator && (
          <div className="flex gap-2 mt-auto">
            <Button
              variant="outline"
              onClick={() => {
                // Navigate to edit community
                window.location.href = `/communities/${community._id}/edit`;
              }}
              className="flex-1"
            >
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Navigate to community details
                window.location.href = `/communities/${community._id}`;
              }}
            >
              View
            </Button>
          </div>
        )}

        {/* Creation date */}
        <div className="text-xs text-gray-500 mt-3 pt-3 border-t">
          Created {new Date(community.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Card>
  );
};

export default CommunityCard;