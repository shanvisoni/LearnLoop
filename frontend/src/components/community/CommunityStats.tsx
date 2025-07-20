import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { useCommunityStats } from '../../hooks/useCommunities';

interface CommunityStatsProps {
  communityId: string;
}

const CommunityStats: React.FC<CommunityStatsProps> = ({ communityId }) => {
  const { data: stats, isLoading, error } = useCommunityStats(communityId);

  if (isLoading) {
    return (
      <Card className="p-6 text-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <p className="mt-2 text-gray-500">Loading community stats...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-500">Failed to load community statistics</p>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getActivityLevel = (memberCount: number, postCount: number) => {
    const activityRatio = postCount / Math.max(memberCount, 1);
    if (activityRatio >= 0.5) return { level: 'High', color: 'bg-green-500' };
    if (activityRatio >= 0.2) return { level: 'Medium', color: 'bg-yellow-500' };
    return { level: 'Low', color: 'bg-red-500' };
  };

  const activity = getActivityLevel(stats.memberCount, stats.postCount);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Statistics</h3>
      
      <div className="space-y-4">
        {/* Member and Post Counts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.memberCount}</div>
            <div className="text-sm text-gray-600">
              {stats.memberCount === 1 ? 'Member' : 'Members'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.postCount}</div>
            <div className="text-sm text-gray-600">
              {stats.postCount === 1 ? 'Post' : 'Posts'}
            </div>
          </div>
        </div>

        {/* Privacy Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Privacy:</span>
          <Badge className={`${stats.isPrivate ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
            {stats.isPrivate ? 'Private' : 'Public'}
          </Badge>
        </div>

        {/* Activity Level */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Activity Level:</span>
          <Badge className={`${activity.color} text-white`}>
            {activity.level}
          </Badge>
        </div>

        {/* Creation Date */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Created:</span>
          <span className="text-sm text-gray-600">{formatDate(stats.createdAt)}</span>
        </div>

        {/* Additional Metrics */}
        {stats.memberCount > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Posts per member:</span>
                <span>{(stats.postCount / stats.memberCount).toFixed(1)}</span>
              </div>
              {stats.postCount > 0 && (
                <div className="flex justify-between">
                  <span>Engagement rate:</span>
                  <span>{Math.round((stats.postCount / stats.memberCount) * 100)}%</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CommunityStats;