// import React from 'react';
// import { ChevronDown, BarChart3, CheckCircle, Clock, AlertCircle } from 'lucide-react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import type { TaskStats } from '../../types/task.types';

// interface TaskStatusDropdownProps {
//   stats: TaskStats;
//   isOpen: boolean;
//   onToggle: () => void;
// }

// export const TaskStatusDropdown: React.FC<TaskStatusDropdownProps> = ({
//   stats,
//   isOpen,
//   onToggle
// }) => {
//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'total':
//         return <BarChart3 className="w-4 h-4" />;
//       case 'pending':
//         return <AlertCircle className="w-4 h-4" />;
//       case 'inProgress':
//         return <Clock className="w-4 h-4" />;
//       case 'completed':
//         return <CheckCircle className="w-4 h-4" />;
//       default:
//         return <BarChart3 className="w-4 h-4" />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'total':
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'inProgress':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'completed':
//         return 'bg-green-100 text-green-800 border-green-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const getStatusLabel = (status: string) => {
//     switch (status) {
//       case 'total':
//         return 'Total Tasks';
//       case 'pending':
//         return 'Pending';
//       case 'inProgress':
//         return 'In Progress';
//       case 'completed':
//         return 'Completed';
//       default:
//         return status;
//     }
//   };

//   const statsArray = [
//     { key: 'total', value: stats.total },
//     { key: 'pending', value: stats.pending },
//     { key: 'inProgress', value: stats.inProgress },
//     { key: 'completed', value: stats.completed },
//   ];

//   return (
//     <DropdownMenu open={isOpen} onOpenChange={onToggle}>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" className="flex items-center gap-2">
//           <BarChart3 className="w-4 h-4" />
//           Task Stats
//           <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-64 p-4" align="end">
//         <div className="space-y-3">
//           <div className="text-sm font-medium text-gray-900 mb-3">
//             Task Overview
//           </div>
          
//           {statsArray.map(({ key, value }) => (
//             <div key={key} className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 {getStatusIcon(key)}
//                 <span className="text-sm text-gray-700">
//                   {getStatusLabel(key)}
//                 </span>
//               </div>
//               <Badge variant="secondary" className={`${getStatusColor(key)} border`}>
//                 {value}
//               </Badge>
//             </div>
//           ))}
          
//           {/* Progress bar */}
//           <div className="mt-4 pt-3 border-t">
//             <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
//               <span>Progress</span>
//               <span>
//                 {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
//               </span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="bg-green-500 h-2 rounded-full transition-all duration-300"
//                 style={{ 
//                   width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` 
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };