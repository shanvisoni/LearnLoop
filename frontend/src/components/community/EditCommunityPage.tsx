// src/pages/community/EditCommunityPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Plus, Globe, Lock, Loader2 } from 'lucide-react';
import { useCommunityById, useUpdateCommunity } from '../../hooks/useCommunities';
import type { UpdateCommunityDto } from '../../types/community.types';

const EditCommunityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Fetch community data
  const { data: community, isLoading, error } = useCommunityById(id!);
  const updateCommunityMutation = useUpdateCommunity();
  
  // Form state
  const [formData, setFormData] = useState<UpdateCommunityDto>({
    name: '',
    description: '',
    tags: [],
    isPrivate: false,
  });
  
  const [newTag, setNewTag] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data when community loads
  useEffect(() => {
    if (community) {
      setFormData({
        name: community.name || '',
        description: community.description || '',
        // tags: [...community.tags],
        tags: [...(community.tags || [])],
        isPrivate: community.isPrivate || false,
      });
    }
  }, [community]);

  // Track changes
  useEffect(() => {
    if (community) {
      const hasChanged = 
        formData.name !== community.name ||
        formData.description !== community.description ||
        formData.isPrivate !== community.isPrivate ||
        JSON.stringify(formData.tags) !== JSON.stringify(community.tags);
      
      setHasChanges(hasChanged);
    }
  }, [formData, community]);

  const handleInputChange = (field: keyof UpdateCommunityDto, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasChanges) {
      navigate(`/communities/${id}`);
      return;
    }

    try {
      await updateCommunityMutation.mutateAsync({
        id: id!,
         data: formData,
      });
      navigate(`/communities/${id}`);
    } catch (error) {
      console.error('Failed to update community:', error);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate(`/communities/${id}`);
      }
    } else {
      navigate(`/communities/${id}`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !community) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Community Not Found</h2>
          <p className="text-red-600 mb-4">
            The community you're trying to edit could not be found or you don't have permission to edit it.
          </p>
          <button
            onClick={() => navigate('/communities/my-communities')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to My Communities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Community</h1>
          <p className="text-gray-600">Update your community settings and information</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 space-y-6">
          {/* Community Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Community Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter community name"
              required
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              {(formData.name || '').length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Describe your community..."
              required
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {(formData.description || '').length}/500 characters
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 hover:text-blue-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a tag..."
                maxLength={30}
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!newTag.trim() || formData.tags?.includes(newTag.trim())}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Tags help others discover your community
            </p>
          </div>

          {/* Privacy Setting */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Privacy Setting
            </label>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="privacy"
                  checked={!formData.isPrivate}
                  onChange={() => handleInputChange('isPrivate', false)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-gray-900">Public</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Anyone can discover and join this community
                  </p>
                </div>
              </label>
              
              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="privacy"
                  checked={formData.isPrivate}
                  onChange={() => handleInputChange('isPrivate', true)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-gray-900">Private</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Only invited members can join this community
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {hasChanges ? (
              <span className="text-orange-600 font-medium">You have unsaved changes</span>
            ) : (
              <span>No changes made</span>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!hasChanges || updateCommunityMutation.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {updateCommunityMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCommunityPage;