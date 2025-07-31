import React, { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useJoinCommunity, useLeaveCommunity,useJoinedCommunities, useCommunityPosts  } from '../../hooks/useCommunities';
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
  isJoined: initialIsJoined = false,
  onJoin,
  onLeave,
  showActions = true,
  currentUserId
}) => {
  const joinMutation = useJoinCommunity();
  const leaveMutation = useLeaveCommunity();
    const [ isProcessing, setIsProcessing] = useState(false);
const [localIsJoined, setLocalIsJoined] = useState(initialIsJoined);

const { data: joinedCommunities } = useJoinedCommunities();
  const { data: postsData } = useCommunityPosts(community._id, 1, 1);

useEffect(() => {
    setLocalIsJoined(initialIsJoined);
  }, [initialIsJoined]);

  // Also check membership based on community members array
  const isMemberInCommunity = React.useMemo(() => {
    if (!currentUserId || !community.members) return false;
    
    return community.members.some((member: any) => {
      // Handle both string IDs and populated member objects
      const memberId = typeof member === 'string' ? member : member._id;
      return memberId === currentUserId;
    });
  }, [community.members, currentUserId]);

  // Check if user is in joined communities list (most reliable source)
  const isInJoinedCommunities = React.useMemo(() => {
    if (!currentUserId || !joinedCommunities) return false;
    return joinedCommunities.some(joinedCommunity => joinedCommunity._id === community._id);
  }, [joinedCommunities, community._id, currentUserId]);

  // Use the most accurate membership status
  const isJoined =isInJoinedCommunities || localIsJoined || isMemberInCommunity;

const handleJoinLeave = async (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  // Add more specific loading check
  if (isProcessing||joinMutation.isPending || leaveMutation.isPending) {
     console.log('Operation already in progress, ignoring click');
    return;
  }

 if (!community?._id) {
      console.error('Community ID is missing');
      return;
    }

    setIsProcessing(true);
  
  try {
    console.log(`${isJoined ? 'Leaving' : 'Joining'} community:`, community._id);
    if (isJoined) {
      await leaveMutation.mutateAsync(community._id);
      setLocalIsJoined(false); // Update local state immediately
        onLeave?.(community._id);
        console.log('Successfully left community');
    } else {
      await joinMutation.mutateAsync(community._id);
        setLocalIsJoined(true); // Update local state immediately  
        onJoin?.(community._id);
        console.log('Successfully joined community');
    }
  } catch (error: any) {
      console.error('Join/Leave error:', {
        error,
        communityId: community._id,
        isJoined,
        response: error?.response?.data,
        status: error?.response?.status
      });
    if (isJoined) {
        setLocalIsJoined(true);
      } else {
        setLocalIsJoined(false);
      }
    } finally {
      setIsProcessing(false);
    }
};

  const isCreator = currentUserId === community.creatorId._id;
  const memberCount = community.members?.length || 0;
  const postCount = postsData?.total ?? 0;

  // Determine if button should be disabled
 const isButtonDisabled = isProcessing || joinMutation.isPending || leaveMutation.isPending;
 
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
  // disabled={joinMutation.isPending || leaveMutation.isPending}
  disabled={isButtonDisabled}
  variant={isJoined ? "outline" : "default"}
  className="flex-1"
>
    {isButtonDisabled ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {isJoined ? 'Leaving...' : 'Joining...'}
                </span>
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




// import React, { useEffect, useState } from 'react';
// import { Card } from '../ui/card';
// import { Badge } from '../ui/badge';
// import { Button } from '../ui/button';
// import { useJoinCommunity, useLeaveCommunity, useJoinedCommunities, useCommunityPosts } from '../../hooks/useCommunities';
// import type { Community } from '../../types/community.types';

// interface CommunityCardProps {
//   community: Community;
//   isJoined?: boolean;
//   onJoin?: (communityId: string) => void;
//   onLeave?: (communityId: string) => void;
//   showActions?: boolean;
//   currentUserId?: string;
// }

// const CommunityCard: React.FC<CommunityCardProps> = ({
//   community,
//   isJoined: initialIsJoined = false,
//   onJoin,
//   onLeave,
//   showActions = true,
//   currentUserId
// }) => {
//   const joinMutation = useJoinCommunity();
//   const leaveMutation = useLeaveCommunity();
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [localIsJoined, setLocalIsJoined] = useState(initialIsJoined);
  
//   // Get joined communities data
//   const { data: joinedCommunities } = useJoinedCommunities();
  
//   // Get actual post count from API
//   const { data: postsData } = useCommunityPosts(community._id, 1, 1); // Only need count, so limit to 1

//   useEffect(() => {
//     setLocalIsJoined(initialIsJoined);
//   }, [initialIsJoined]);

//   // Also check membership based on community members array
//   const isMemberInCommunity = React.useMemo(() => {
//     if (!currentUserId || !community.members) return false;
    
//     return community.members.some((member: any) => {
//       // Handle both string IDs and populated member objects
//       const memberId = typeof member === 'string' ? member : member._id;
//       return memberId === currentUserId;
//     });
//   }, [community.members, currentUserId]);

//   // Check if user is in joined communities list (most reliable source)
//   const isInJoinedCommunities = React.useMemo(() => {
//     if (!currentUserId || !joinedCommunities) return false;
//     return joinedCommunities.some(joinedCommunity => joinedCommunity._id === community._id);
//   }, [joinedCommunities, community._id, currentUserId]);

//   // Use the most accurate membership status
//   const isJoined = isInJoinedCommunities || localIsJoined || isMemberInCommunity;

//   const handleJoinLeave = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     // Add more specific loading check
//     if (isProcessing || joinMutation.isPending || leaveMutation.isPending) {
//       console.log('Operation already in progress, ignoring click');
//       return;
//     }

//     if (!community?._id) {
//       console.error('Community ID is missing');
//       return;
//     }

//     setIsProcessing(true);
  
//     try {
//       console.log(`${isJoined ? 'Leaving' : 'Joining'} community:`, community._id);
//       if (isJoined) {
//         await leaveMutation.mutateAsync(community._id);
//         setLocalIsJoined(false); // Update local state immediately
//         onLeave?.(community._id);
//         console.log('Successfully left community');
//       } else {
//         await joinMutation.mutateAsync(community._id);
//         setLocalIsJoined(true); // Update local state immediately  
//         onJoin?.(community._id);
//         console.log('Successfully joined community');
//       }
//     } catch (error: any) {
//       console.error('Join/Leave error:', {
//         error,
//         communityId: community._id,
//         isJoined,
//         response: error?.response?.data,
//         status: error?.response?.status
//       });
//       if (isJoined) {
//         setLocalIsJoined(true);
//       } else {
//         setLocalIsJoined(false);
//       }
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const isCreator = currentUserId === community.creatorId._id;
//   const memberCount = community.members?.length || 0;
  
//   // Use actual post count from API instead of posts array length
//   const postCount = postsData?.total ?? 0;

//   // Determine if button should be disabled
//   const isButtonDisabled = isProcessing || joinMutation.isPending || leaveMutation.isPending;

//   return (
//     <Card className="p-6 hover:shadow-md transition-shadow duration-200">
//       <div className="flex flex-col h-full">
//         {/* Header */}
//         <div className="flex items-start justify-between mb-3">
//           <div className="flex-1">
//             <h3 className="text-lg font-semibold text-gray-900 mb-1">
//               {community.name}
//             </h3>
//             <p className="text-sm text-gray-600">
//               Created by {community.creatorId.firstName} {community.creatorId.lastName}
//             </p>
//           </div>
//           {community.isPrivate && (
//             <Badge variant="secondary" className="ml-2">
//               Private
//             </Badge>
//           )}
//         </div>

//         {/* Description */}
//         <p className="text-gray-700 text-sm mb-4 flex-1 line-clamp-3">
//           {community.description}
//         </p>

//         {/* Tags */}
//         {community.tags && community.tags.length > 0 && (
//           <div className="flex flex-wrap gap-2 mb-4">
//             {community.tags.slice(0, 3).map((tag, index) => (
//               <Badge key={index} variant="outline" className="text-xs">
//                 {tag}
//               </Badge>
//             ))}
//             {community.tags.length > 3 && (
//               <Badge variant="outline" className="text-xs">
//                 +{community.tags.length - 3} more
//               </Badge>
//             )}
//           </div>
//         )}

//         {/* Stats */}
//         <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
//           <div className="flex items-center gap-1">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
//                     d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//             </svg>
//             <span>{memberCount} members</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
//                     d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7" />
//             </svg>
//             <span>{postCount} posts</span>
//           </div>
//         </div>

//         {/* Actions */}
//         {showActions && !isCreator && (
//           <div className="flex gap-2 mt-auto">
//             <Button
//               onClick={handleJoinLeave}
//               disabled={isButtonDisabled}
//               variant={isJoined ? "outline" : "default"}
//               className="flex-1"
//             >
//               {(joinMutation.isPending || leaveMutation.isPending || isProcessing) ? (
//                 <span className="flex items-center gap-2">
//                   <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
//                   {isJoined ? 'Leaving...' : 'Joining...'}
//                 </span>
//               ) : (
//                 isJoined ? 'Leave' : 'Join'
//               )}
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 // Navigate to community details
//                 window.location.href = `/communities/${community._id}`;
//               }}
//             >
//               View
//             </Button>
//           </div>
//         )}

//         {/* Creator actions */}
//         {showActions && isCreator && (
//           <div className="flex gap-2 mt-auto">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 // Navigate to edit community
//                 window.location.href = `/communities/${community._id}/edit`;
//               }}
//               className="flex-1"
//             >
//               Edit
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 // Navigate to community details
//                 window.location.href = `/communities/${community._id}`;
//               }}
//             >
//               View
//             </Button>
//           </div>
//         )}

//         {/* Creation date */}
//         <div className="text-xs text-gray-500 mt-3 pt-3 border-t">
//           Created {new Date(community.createdAt).toLocaleDateString()}
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default CommunityCard;