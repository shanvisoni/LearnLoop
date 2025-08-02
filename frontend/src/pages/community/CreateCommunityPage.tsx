import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityForm from '../../components/community/CommunityForm';
import { useCreateCommunity } from '../../hooks/useCommunities';
import type { CreateCommunityDto, UpdateCommunityDto } from '../../types/community.types';

const CreateCommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateCommunity();

  const handleSubmit = async (data: CreateCommunityDto | UpdateCommunityDto) => {
    try {
      const newCommunity = await createMutation.mutateAsync(data as CreateCommunityDto);
       navigate('/communities', { 
        replace: true,
        state: { 
          message: 'Community created successfully!',
          newCommunityId: newCommunity._id 
        }
      });
    } catch (error) {
      console.error('Failed to create community:', error);
    }
  };

  const handleCancel = () => {

        navigate('/dashboard');

  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <button 
              onClick={() => navigate('/communities/view')}
              className="hover:text-blue-600 transition-colors"
            >
              Communities
            </button>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>Create Community</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Community
          </h1>
          <p className="mt-2 text-gray-600">
            Start your own community and bring people together around shared interests.
          </p>
        </div>

        {/* Community Form */}
        <div className="bg-white rounded-lg shadow-sm">
          <CommunityForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEditing={false}
          />
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">
            Tips for Creating a Successful Community
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Choose a clear, descriptive name that reflects your community's purpose</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Write a detailed description explaining what members can expect</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Add relevant tags to help people discover your community</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Consider starting as public to encourage initial growth</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunityPage;