// // src/pages/community/CommunityDashboard.tsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Users, 
//   Plus, 
//   Eye, 
//   UserCheck, 
//   Settings,
//   TrendingUp,
//   Calendar,
//   MessageCircle
// } from 'lucide-react';
// import { useMyCreatedCommunities, useJoinedCommunities } from '../../hooks/useCommunities';

// const CommunityDashboard: React.FC = () => {
//   const navigate = useNavigate();
//   const { data: createdCommunities, isLoading: loadingCreated } = useMyCreatedCommunities();
//   const { data: joinedCommunities, isLoading: loadingJoined } = useJoinedCommunities();

//   const stats = [
//     {
//       title: 'Created Communities',
//       value: createdCommunities?.length || 0,
//       icon: Plus,
//       color: 'bg-blue-500',
//       onClick: () => navigate('/communities/my-communities'),
//     },
//     {
//       title: 'Joined Communities',
//       value: joinedCommunities?.length || 0,
//       icon: UserCheck,
//       color: 'bg-green-500',
//       onClick: () => navigate('/communities/joined'),
//     },
//     {
//       title: 'Total Members',
//       value: createdCommunities?.reduce((acc, community) => acc + community.members.length, 0) || 0,
//       icon: Users,
//       color: 'bg-purple-500',
//       onClick: () => navigate('/communities/my-communities'),
//     },
//   ];

//   const quickActions = [
//     {
//       title: 'Create New Community',
//       description: 'Start a new learning community',
//       icon: Plus,
//       color: 'bg-blue-500',
//       onClick: () => navigate('/communities/create'),
//     },
//     {
//       title: 'Browse Communities',
//       description: 'Discover and join existing communities',
//       icon: Eye,
//       color: 'bg-green-500',
//       onClick: () => navigate('/communities/browse'),
//     },
//     {
//       title: 'My Communities',
//       description: 'Manage communities you created',
//       icon: Settings,
//       color: 'bg-purple-500',
//       onClick: () => navigate('/communities/my-communities'),
//     },
//     {
//       title: 'Joined Communities',
//       description: 'View communities you are part of',
//       icon: UserCheck,
//       color: 'bg-orange-500',
//       onClick: () => navigate('/communities/joined'),
//     },
//   ];

//   if (loadingCreated || loadingJoined) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 py-6">
//         <div className="animate-pulse space-y-6">
//           <div className="h-8 bg-gray-200 rounded w-1/3"></div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Dashboard</h1>
//         <p className="text-gray-600">
//           Manage your learning communities and connect with fellow learners
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         {stats.map((stat, index) => (
//           <div
//             key={index}
//             onClick={stat.onClick}
//             className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
//           >
//             <div className="flex items-center">
//               <div className={`${stat.color} p-3 rounded-lg`}>
//                 <stat.icon className="h-6 w-6 text-white" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">{stat.title}</p>
//                 <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Quick Actions */}
//       <div className="mb-8">
//         <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {quickActions.map((action, index) => (
//             <div
//               key={index}
//               onClick={action.onClick}
//               className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
//             >
//               <div className={`${action.color} p-3 rounded-lg w-fit mb-4`}>
//                 <action.icon className="h-6 w-6 text-white" />
//               </div>
//               <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
//               <p className="text-sm text-gray-600">{action.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Recent Communities */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* My Created Communities */}
//         <div>
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-semibold text-gray-900">My Communities</h2>
//             <button
//               onClick={() => navigate('/communities/my-communities')}
//               className="text-blue-600 hover:text-blue-700 text-sm font-medium"
//             >
//               View All
//             </button>
//           </div>
//           <div className="space-y-4">
//             {createdCommunities && createdCommunities.length > 0 ? (
//               createdCommunities.slice(0, 3).map((community) => (
//                 <div
//                   key={community._id}
//                   onClick={() => navigate(`/communities/${community._id}`)}
//                   className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-sm transition-shadow"
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <h3 className="font-medium text-gray-900">{community.name}</h3>
//                       <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//                         {community.description}
//                       </p>
//                       <div className="flex items-center mt-2 text-xs text-gray-500">
//                         <Users className="h-3 w-3 mr-1" />
//                         {community.members.length} members
//                         <Calendar className="h-3 w-3 ml-3 mr-1" />
//                         {new Date(community.createdAt).toLocaleDateString()}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                 <p>No communities created yet</p>
//                 <button
//                   onClick={() => navigate('/communities/create')}
//                   className="text-blue-600 hover:text-blue-700 text-sm mt-2"
//                 >
//                   Create your first community
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Joined Communities */}
//         <div>
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-semibold text-gray-900">Joined Communities</h2>
//             <button
//               onClick={() => navigate('/communities/joined')}
//               className="text-blue-600 hover:text-blue-700 text-sm font-medium"
//             >
//               View All
//             </button>
//           </div>
//           <div className="space-y-4">
//             {joinedCommunities && joinedCommunities.length > 0 ? (
//               joinedCommunities.slice(0, 3).map((community) => (
//                 <div
//                   key={community._id}
//                   onClick={() => navigate(`/communities/${community._id}`)}
//                   className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-sm transition-shadow"
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <h3 className="font-medium text-gray-900">{community.name}</h3>
//                       <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//                         {community.description}
//                       </p>
//                       <div className="flex items-center mt-2 text-xs text-gray-500">
//                         <Users className="h-3 w-3 mr-1" />
//                         {community.members.length} members
//                         <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
//                           Member
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 <UserCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                 <p>No communities joined yet</p>
//                 <button
//                   onClick={() => navigate('/communities/browse')}
//                   className="text-blue-600 hover:text-blue-700 text-sm mt-2"
//                 >
//                   Browse communities
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CommunityDashboard;