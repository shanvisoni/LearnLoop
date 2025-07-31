import React from 'react';
import { Users, Calendar, Lock, Globe } from 'lucide-react';
import type { Community } from '../../types/community.types';
import { useJoinCommunity, useLeaveCommunity } from '../../hooks/useCommunities';
import {Button} from '../ui/button';
import {Badge} from '../ui/badge';

interface CommunityHeaderProps {
  community: Community;
  isJoined: boolean;
  currentUserId?: string;
  activeTab?: 'overview' | 'posts' | 'members';
}

const CommunityHeader: React.FC<CommunityHeaderProps> = ({
  community,
  isJoined,
  currentUserId,
  // activeTab = 'overview'
}) => {
  // const navigate = useNavigate();
  const joinMutation = useJoinCommunity();
  const leaveMutation = useLeaveCommunity();

  const isCreator = currentUserId === community.creatorId._id;
  const canJoinLeave = currentUserId && !isCreator;

  const handleJoinLeave = async () => {
    if (isJoined) {
      await leaveMutation.mutateAsync(community._id);
    } else {
      await joinMutation.mutateAsync(community._id);
    }
  };

  // const handleTabClick = (tab: string) => {
  //   if (tab === 'posts') {
  //     navigate(`/communities/${community._id}`);
  //   } else if (tab === 'overview') {
  //     navigate(`/communities/${community._id}`);
  //   }
  //   // Members tab can be handled in CommunityDetails page
  // };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{community.name}</h1>
              {community.isPrivate ? (
                <Lock className="w-6 h-6" />
              ) : (
                <Globe className="w-6 h-6" />
              )}
            </div>
            
            <p className="text-blue-100 text-lg mb-4 max-w-3xl">
              {community.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {community.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Community Info */}
            <div className="flex items-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{community.members.length} members</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created {formatDate(community.createdAt)}</span>
              </div>
              <div>
                <span>by {community.creatorId.firstName} {community.creatorId.lastName}</span>
              </div>
            </div>
          </div>

          {/* Join/Leave Button */}
          {canJoinLeave && (
            <div className="ml-6">
              <Button
                onClick={handleJoinLeave}
                disabled={joinMutation.isPending || leaveMutation.isPending}
                variant={isJoined ? "secondary" : "default"}
                className={isJoined 
                  ? "bg-white/20 hover:bg-white/30 text-white border-white/30" 
                  : "bg-white text-blue-600 hover:bg-blue-50"
                }
              >
                {joinMutation.isPending || leaveMutation.isPending
                  ? "Loading..."
                  : isJoined
                  ? "Leave Community"
                  : "Join Community"
                }
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
   {/*    <div className="border-b border-gray-200">
        <nav className="flex px-6">
          <button
            onClick={() => handleTabClick('overview')}
            className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => handleTabClick('posts')}
            className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'posts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Posts ({community.posts.length})
          </button>
          <button
            className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'members'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Members ({community.members.length})
          </button>
        </nav>
      </div>*/}
    </div>
  );
};

export default CommunityHeader;