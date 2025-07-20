import React from 'react';
import CommunityCard from './CommunityCard';
import type { Community } from '../../types/community.types';

interface CommunityListProps {
  communities: Community[];
  isLoading: boolean;
  currentUserId?: string;
  onJoin?: (communityId: string) => void;
  onLeave?: (communityId: string) => void;
  showActions?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
}

// Loading Spinner Component (since shadcn doesn't have it)
const LoadingSpinner: React.FC<{ message?: string }> = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3" />
    <p className="text-gray-600 text-sm">{message}</p>
  </div>
);

// Empty State Component
const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No Communities Found</h3>
    <p className="text-gray-600 max-w-md mx-auto">{message}</p>
  </div>
);

const CommunityList: React.FC<CommunityListProps> = ({
  communities,
  isLoading,
  currentUserId,
  onJoin,
  onLeave,
  showActions = true,
  emptyMessage = "No communities match your search criteria. Try adjusting your filters or search terms.",
  loadingMessage = "Loading communities..."
}) => {
  // Show loading state
  if (isLoading) {
    return <LoadingSpinner message={loadingMessage} />;
  }

  // Show empty state
  if (!communities || communities.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  // Render communities grid
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {communities.map((community) => {
        // Check if current user is a member of this community
        const isJoined = community.members?.some(
          (member: any) => member._id === currentUserId || member === currentUserId
        ) || false;

        return (
          <CommunityCard
            key={community._id}
            community={community}
            isJoined={isJoined}
            currentUserId={currentUserId}
            onJoin={onJoin}
            onLeave={onLeave}
            showActions={showActions}
          />
        );
      })}
    </div>
  );
};

export default CommunityList;