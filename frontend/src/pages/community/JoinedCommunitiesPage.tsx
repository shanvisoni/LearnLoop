import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityList from '../../components/community/CommunityList';
import { useJoinedCommunities, useLeaveCommunity } from '../../hooks/useCommunities';
import { useAuthContext } from '../../contexts/auth'; // Adjust import path as needed

const JoinedCommunitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext(); // Get current user from auth context
  
  // Fetch joined communities
  const { 
    data: joinedCommunities = [], 
    isLoading, 
    error 
  } = useJoinedCommunities();
  
  // Leave community mutation
  const leaveCommunityMutation = useLeaveCommunity();

  // Handle leaving a community
  const handleLeaveCommunity = async (communityId: string) => {
    try {
      await leaveCommunityMutation.mutateAsync(communityId);
    } catch (error) {
      console.error('Failed to leave community:', error);
    }
  };

//   // Handle community card click - navigate to community details
//   const handleCommunityClick = (communityId: string) => {
//     navigate(`/communities/${communityId}`);
//   };

//   // Handle viewing community posts
//   const handleViewPosts = (communityId: string) => {
//     navigate(`/communities/${communityId}/posts`);
//   };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-red-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Communities</h3>
            <p className="text-gray-600 mb-4">
              We couldn't load your joined communities. Please try again.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Joined Communities</h1>
              <p className="mt-2 text-gray-600">
                Communities you're a member of ({joinedCommunities.length})
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/communities/view')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Discover More
              </button>
              
              <button
                onClick={() => navigate('/communities/create')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Community
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {joinedCommunities.length > 0 && (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Communities</p>
                  <p className="text-2xl font-semibold text-gray-900">{joinedCommunities.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Memberships</p>
                  <p className="text-2xl font-semibold text-gray-900">{joinedCommunities.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h6a2 2 0 002-2V8M9 12h6" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Members</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {joinedCommunities.reduce((total, community) => total + (community.members?.length || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Communities List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <CommunityList
            communities={joinedCommunities}
            isLoading={isLoading}
            currentUserId={user?._id}
            onLeave={handleLeaveCommunity}
            showActions={true}
            emptyMessage="You haven't joined any communities yet. Explore and join communities that interest you!"
            loadingMessage="Loading your joined communities..."
          />
        </div>

        {/* Empty State Action */}
        {!isLoading && joinedCommunities.length === 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/communities')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore Communities
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinedCommunitiesPage;