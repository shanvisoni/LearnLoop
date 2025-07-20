// src/pages/community/MyCommunities.tsx
import React, { useState } from 'react';
import { Users, Calendar, Settings, Eye, UserPlus, Lock, Globe } from 'lucide-react';
import { useMyCreatedCommunities, useDeleteCommunity } from '../../hooks/useCommunities';
import { useNavigate } from 'react-router-dom';
import type { Community } from '../../types/community.types';

const MyCommunitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: communities, isLoading, error } = useMyCreatedCommunities();
  const deleteCommunityMutation = useDeleteCommunity();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleViewCommunity = (communityId: string) => {
    navigate(`/communities/${communityId}`);
  };

  const handleEditCommunity = (communityId: string) => {
    navigate(`/communities/${communityId}/edit`);
  };

  const handleDeleteCommunity = async (communityId: string) => {
    await deleteCommunityMutation.mutateAsync(communityId);
    setShowDeleteConfirm(null);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load your communities. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Communities</h1>
          <p className="text-gray-600">Communities you've created and manage</p>
        </div>
        <button
          onClick={() => navigate('/communities/create')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create New Community
        </button>
      </div>

      {/* Communities List */}
      {communities && communities.length > 0 ? (
        <div className="space-y-6">
          {communities.map((community: Community) => (
            <div key={community._id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {community.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {community.isPrivate ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Lock className="h-3 w-3 mr-1" />
                            Private
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Globe className="h-3 w-3 mr-1" />
                            Public
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{community.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {community.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{community.members.length} members</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Created {new Date(community.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-6">
                    <button
                      onClick={() => handleViewCommunity(community._id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="View Community"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEditCommunity(community._id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="Edit Community"
                    >
                      <Settings className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(community._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete Community"
                    >
                      <UserPlus className="h-5 w-5 rotate-45" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No communities yet</h3>
          <p className="text-gray-500 mb-6">
            You haven't created any communities yet. Create your first community to get started.
          </p>
          <button
            onClick={() => navigate('/communities/create')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Your First Community
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Community</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this community? This action cannot be undone.
              All posts and members will be removed.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCommunity(showDeleteConfirm)}
                disabled={deleteCommunityMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleteCommunityMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCommunitiesPage;