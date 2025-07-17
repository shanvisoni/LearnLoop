// // import React, { useState } from 'react';
// // import { 
// //   Edit, 
// //   Trash2, 
// //   Calendar, 
// //   Clock, 
// //   AlertCircle,
// //   CheckCircle,
// //   Circle,
// //   MoreVertical,
// //   Loader2
// // } from 'lucide-react';
// // import { 
// //   type Task, 
// //   TaskStatus, 
// //   TASK_PRIORITY_COLORS, 
// //   TASK_STATUS_COLORS,
// //   TASK_STATUS_LABELS,
// //   TASK_PRIORITY_LABELS
// // } from '../../types/task.types';

// // interface TaskCardProps {
// //   task: Task;
// //   onEdit: () => void;
// //   onDelete: () => void;
// //   onStatusChange: (status: TaskStatus) => void;
// //   isUpdating?: boolean;
// //   isDeleting?: boolean;
// // }

// // export const TaskCard: React.FC<TaskCardProps> = ({ 
// //   task, 
// //   onEdit, 
// //   onDelete, 
// //   onStatusChange,
// //   isUpdating = false,
// //   isDeleting = false
// // }) => {
// //   const [isMenuOpen, setIsMenuOpen] = useState(false);

// //   const getStatusIcon = (status: TaskStatus) => {
// //     switch (status) {
// //       case TaskStatus.PENDING:
// //         return <Circle className="w-4 h-4 text-yellow-600" />;
// //       case TaskStatus.IN_PROGRESS:
// //         return <Clock className="w-4 h-4 text-blue-600" />;
// //       case TaskStatus.COMPLETED:
// //         return <CheckCircle className="w-4 h-4 text-green-600" />;
// //       default:
// //         return <Circle className="w-4 h-4 text-gray-400" />;
// //     }
// //   };

// //   const formatDate = (date: Date | string) => {
// //     return new Date(date).toLocaleDateString('en-US', {
// //       year: 'numeric',
// //       month: 'short',
// //       day: 'numeric',
// //     });
// //   };

// //   const isOverdue = (dueDate: Date | string | undefined) => {
// //     if (!dueDate) return false;
// //     return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
// //   };

// //   return (
// //     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative">
// //       {/* Loading overlay */}
// //       {(isUpdating || isDeleting) && (
// //         <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
// //           <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
// //         </div>
// //       )}

// //       <div className="flex items-start justify-between">
// //         <div className="flex-1">
// //           <div className="flex items-center gap-3 mb-2">
// //             {getStatusIcon(task.status)}
// //             <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
// //             <span className={`px-2 py-1 rounded-full text-xs font-medium border ${TASK_PRIORITY_COLORS[task.priority]}`}>
// //               {TASK_PRIORITY_LABELS[task.priority]}
// //             </span>
// //           </div>
          
// //           {task.description && (
// //             <p className="text-gray-600 mb-3 line-clamp-2">{task.description}</p>
// //           )}
          
// //           <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
// //             <span className={`px-2 py-1 rounded-full text-xs font-medium border ${TASK_STATUS_COLORS[task.status]}`}>
// //               {TASK_STATUS_LABELS[task.status]}
// //             </span>
            
// //             {task.dueDate && (
// //               <div className={`flex items-center gap-1 ${isOverdue(task.dueDate) ? 'text-red-600' : ''}`}>
// //                 <Calendar className="w-4 h-4" />
// //                 <span>Due: {formatDate(task.dueDate)}</span>
// //                 {isOverdue(task.dueDate) && <AlertCircle className="w-4 h-4 text-red-600" />}
// //               </div>
// //             )}
            
// //             <div className="flex items-center gap-1">
// //               <Clock className="w-4 h-4" />
// //               <span>Created: {formatDate(task.createdAt)}</span>
// //             </div>
// //           </div>
// //         </div>
        
// //         <div className="flex items-center gap-2">
// //           {/* Quick Status Change Buttons */}
// //           <div className="flex items-center gap-1">
// //             {task.status !== TaskStatus.PENDING && (
// //               <button
// //                 onClick={() => onStatusChange(TaskStatus.PENDING)}
// //                 disabled={isUpdating}
// //                 className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors disabled:opacity-50"
// //                 title="Mark as Pending"
// //               >
// //                 <Circle className="w-4 h-4" />
// //               </button>
// //             )}
            
// //             {task.status !== TaskStatus.IN_PROGRESS && (
// //               <button
// //                 onClick={() => onStatusChange(TaskStatus.IN_PROGRESS)}
// //                 disabled={isUpdating}
// //                 className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
// //                 title="Mark as In Progress"
// //               >
// //                 <Clock className="w-4 h-4" />
// //               </button>
// //             )}
            
// //             {task.status !== TaskStatus.COMPLETED && (
// //               <button
// //                 onClick={() => onStatusChange(TaskStatus.COMPLETED)}
// //                 disabled={isUpdating}
// //                 className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
// //                 title="Mark as Completed"
// //               >
// //                 <CheckCircle className="w-4 h-4" />
// //               </button>
// //             )}
// //           </div>
          
// //           {/* More Menu */}
// //           <div className="relative">
// //             <button
// //               onClick={() => setIsMenuOpen(!isMenuOpen)}
// //               disabled={isUpdating || isDeleting}
// //               className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
// //             >
// //               <MoreVertical className="w-4 h-4" />
// //             </button>
            
// //             {isMenuOpen && (
// //               <>
// //                 <div 
// //                   className="fixed inset-0 z-10" 
// //                   onClick={() => setIsMenuOpen(false)}
// //                 />
// //                 <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
// //                   <button
// //                     onClick={() => {
// //                       onEdit();
// //                       setIsMenuOpen(false);
// //                     }}
// //                     className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
// //                   >
// //                     <Edit className="w-4 h-4" />
// //                     Edit Task
// //                   </button>
// //                   <button
// //                     onClick={() => {
// //                       onDelete();
// //                       setIsMenuOpen(false);
// //                     }}
// //                     className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
// //                   >
// //                     <Trash2 className="w-4 h-4" />
// //                     Delete Task
// //                   </button>
// //                 </div>
// //               </>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };







// import React from 'react';
// import { 
//   Calendar, 
//   Clock, 
//   MoreVertical, 
//   Edit2, 
//   Trash2,
//   Loader2,
//   AlertCircle
// } from 'lucide-react';
// import { 
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator
// } from '@/components/ui/dropdown-menu';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { 
//   type Task, 
//   TaskStatus, 
//   TaskPriority,
//   TASK_STATUS_LABELS,
//   TASK_PRIORITY_LABELS,
//   TASK_STATUS_COLORS,
//   TASK_PRIORITY_COLORS
// } from '../../types/task.types';

// interface TaskCardProps {
//   task: Task;
//   onEdit: () => void;
//   onDelete: () => void;
//   onStatusChange: (status: TaskStatus) => void;
//   isUpdating?: boolean;
//   isDeleting?: boolean;
// }

// export const TaskCard: React.FC<TaskCardProps> = ({
//   task,
//   onEdit,
//   onDelete,
//   onStatusChange,
//   isUpdating = false,
//   isDeleting = false
// }) => {
//   const formatDate = (date: Date | string) => {
//     return new Date(date).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const formatTime = (date: Date | string) => {
//     return new Date(date).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const isOverdue = task.dueDate && 
//     new Date(task.dueDate) < new Date() && 
//     task.status !== TaskStatus.COMPLETED;

//   const getStatusOptions = () => {
//     return Object.values(TaskStatus).filter(status => status !== task.status);
//   };

//   return (
//     <div className={`
//       bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow
//       ${isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'}
//       ${(isUpdating || isDeleting) ? 'opacity-50 pointer-events-none' : ''}
//     `}>
//       <div className="flex items-start justify-between">
//         {/* Left side - Task info */}
//         <div className="flex-1 min-w-0">
//           {/* Title and Status */}
//           <div className="flex items-center gap-3 mb-3">
//             <h3 className="text-lg font-semibold text-gray-900 truncate">
//               {task.title}
//             </h3>
//             <Badge 
//               variant="secondary" 
//               className={`${TASK_STATUS_COLORS[task.status]} border`}
//             >
//               {TASK_STATUS_LABELS[task.status]}
//             </Badge>
//           </div>

//           {/* Description */}
//           {task.description && (
//             <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//               {task.description}
//             </p>
//           )}

//           {/* Priority and Dates */}
//           <div className="flex items-center gap-4 text-sm text-gray-500">
//             {/* Priority */}
//             <div className="flex items-center gap-1">
//               <AlertCircle className="w-4 h-4" />
//               <Badge 
//                 variant="outline" 
//                 className={`${TASK_PRIORITY_COLORS[task.priority]} text-xs`}
//               >
//                 {TASK_PRIORITY_LABELS[task.priority]}
//               </Badge>
//             </div>

//             {/* Due Date */}
//             {task.dueDate && (
//               <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : ''}`}>
//                 <Calendar className="w-4 h-4" />
//                 <span className={isOverdue ? 'font-medium' : ''}>
//                   Due: {formatDate(task.dueDate)}
//                 </span>
//               </div>
//             )}

//             {/* Created Date */}
//             <div className="flex items-center gap-1">
//               <Clock className="w-4 h-4" />
//               <span>Created: {formatDate(task.createdAt)}</span>
//             </div>
//           </div>

//           {/* Overdue warning */}
//           {isOverdue && (
//             <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
//               <AlertCircle className="w-4 h-4" />
//               <span className="font-medium">This task is overdue</span>
//             </div>
//           )}
//         </div>

//         {/* Right side - Actions */}
//         <div className="flex items-center gap-2 ml-4">
//           {/* Status Change Buttons */}
//           <div className="flex items-center gap-1">
//             {getStatusOptions().map((status) => (
//               <Button
//                 key={status}
//                 variant="outline"
//                 size="sm"
//                 onClick={() => onStatusChange(status)}
//                 disabled={isUpdating}
//                 className="text-xs px-2 py-1 h-7"
//               >
//                 {isUpdating ? (
//                   <Loader2 className="w-3 h-3 animate-spin" />
//                 ) : (
//                   TASK_STATUS_LABELS[status]
//                 )}
//               </Button>
//             ))}
//           </div>

//           {/* More actions dropdown */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                 <MoreVertical className="w-4 h-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={onEdit}>
//                 <Edit2 className="w-4 h-4 mr-2" />
//                 Edit Task
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem 
//                 onClick={onDelete}
//                 className="text-red-600 focus:text-red-600"
//               >
//                 {isDeleting ? (
//                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                 ) : (
//                   <Trash2 className="w-4 h-4 mr-2" />
//                 )}
//                 Delete Task
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </div>
//   );
// };