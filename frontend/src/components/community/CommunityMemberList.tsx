import React, { useState } from 'react';
import { Card } from '../ui/card';
// import { Pagination } from '../ui/pagination';
import { useCommunityMembers } from '../../hooks/useCommunities';
import type { User } from '../../types/community.types';
import { Button } from '../ui/button';

interface CommunityMembersListProps {
  communityId: string;
  onMemberClick?: (member: User) => void;
  showPagination?: boolean;
  pageSize?: number;
}

// Simple Loading Spinner Component
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin`} />
  );
};

const CommunityMembersList: React.FC<CommunityMembersListProps> = ({
  communityId,
  onMemberClick,
  showPagination = true,
  pageSize = 12
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { 
    data, 
    isLoading, 
    error 
  } = useCommunityMembers(communityId, currentPage, pageSize);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <div className="text-red-600 mb-2">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Error Loading Members
        </div>
        <p className="text-gray-600">Failed to load community members. Please try again.</p>
      </Card>
    );
  }

  const members = data?.members || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  if (members.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Members Yet</h3>
        <p className="text-gray-600">This community doesn't have any members yet.</p>
      </Card>
    );
  }

  const handleMemberClick = (member: User) => {
    if (onMemberClick) {
      onMemberClick(member);
    }
  };

  return (
    <div className="space-y-6">
      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {members.map((member) => (
          <MemberCard 
            key={member._id} 
            member={member} 
            onClick={() => handleMemberClick(member)}
          />
        ))}
      </div>

      {/* Pagination */}
      {/* {showPagination && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showPrevNext={true}
          />
        </div>
      )} */}

      {/* Simple Previous/Next Pagination */}
{showPagination && totalPages > 1 && (
  <div className="flex justify-center items-center space-x-4">
    <Button
      variant="outline"
      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
      disabled={currentPage <= 1}
    >
      Previous
    </Button>
    
    <span className="text-sm text-gray-600">
      Page {currentPage} of {totalPages}
    </span>
    
    <Button
      variant="outline"
      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
      disabled={currentPage >= totalPages}
    >
      Next
    </Button>
  </div>
)}

      {/* Members count */}
      <div className="text-center text-sm text-gray-600">
        Showing {members.length} of {total} members
      </div>
    </div>
  );
};

interface MemberCardProps {
  member: User;
  onClick: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onClick }) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div onClick={onClick} className="text-center">
        {/* Avatar */}
        <div className="mb-3 flex justify-center">
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={`${member.firstName} ${member.lastName}`}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold group-hover:scale-105 transition-transform">
              {getInitials(member.firstName, member.lastName)}
            </div>
          )}
        </div>

        {/* Member Info */}
        <div>
          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            {member.firstName} {member.lastName}
          </h4>
          <p className="text-sm text-gray-600 mt-1">@{member.username}</p>
          
          {/* Bio preview */}
          {member.bio && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">
              {member.bio}
            </p>
          )}

          {/* Contact info indicators */}
          {member.contactInfo && (
            <div className="flex justify-center gap-2 mt-3">
              {member.contactInfo.email && (
                <div className="w-4 h-4 text-gray-400" title="Email available">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {member.contactInfo.linkedin && (
                <div className="w-4 h-4 text-gray-400" title="LinkedIn available">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
              )}
              {member.contactInfo.github && (
                <div className="w-4 h-4 text-gray-400" title="GitHub available">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CommunityMembersList;