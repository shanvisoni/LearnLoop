// import React from 'react';
// import { Search, Filter, X, ArrowUpDown } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';
// import { 
//   type TaskFilters, 
//   TaskStatus, 
//   TaskPriority,
//   TASK_STATUS_LABELS,
//   TASK_PRIORITY_LABELS
// } from '../../types/task.types';

// interface TaskFiltersBarProps {
//   filters: TaskFilters;
//   onFilterChange: (filters: Partial<TaskFilters>) => void;
// }

// export const TaskFiltersBar: React.FC<TaskFiltersBarProps> = ({
//   filters,
//   onFilterChange
// }) => {
//   const handleClearFilters = () => {
//     onFilterChange({
//       search: '',
//       status: undefined,
//       priority: undefined,
//       sortBy: 'createdAt',
//       sortOrder: 'desc'
//     });
//   };

//   const getActiveFiltersCount = () => {
//     let count = 0;
//     if (filters.search) count++;
//     if (filters.status) count++;
//     if (filters.priority) count++;
//     return count;
//   };

//   const activeFiltersCount = getActiveFiltersCount();

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
//       <div className="flex flex-col gap-4">
//         {/* Search and Clear Filters */}
//         <div className="flex items-center gap-4">
//           <div className="relative flex-1 max-w-md">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               placeholder="Search tasks..."
//               value={filters.search || ''}
//               onChange={(e) => onFilterChange({ search: e.target.value })}
//               className="pl-10"
//             />
//           </div>
          
//           {activeFiltersCount > 0 && (
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleClearFilters}
//               className="flex items-center gap-2"
//             >
//               <X className="w-4 h-4" />
//               Clear Filters
//               <Badge variant="secondary" className="ml-1">
//                 {activeFiltersCount}
//               </Badge>
//             </Button>
//           )}
//         </div>

//         {/* Filter Controls */}
//         <div className="flex items-center gap-4 flex-wrap">
//           {/* Status Filter */}
//           <div className="flex items-center gap-2">
//             <Filter className="w-4 h-4 text-gray-500" />
//             <Select
//               value={filters.status || ''}
//               onValueChange={(value) => 
//                 onFilterChange({ status: value as TaskStatus || undefined })
//               }
//             >
//               <SelectTrigger className="w-40">
//                 <SelectValue placeholder="All Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="">All Status</SelectItem>
//                 {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
//                   <SelectItem key={value} value={value}>
//                     {label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Priority Filter */}
//           <div className="flex items-center gap-2">
//             <Select
//               value={filters.priority || ''}
//               onValueChange={(value) => 
//                 onFilterChange({ priority: value as TaskPriority || undefined })
//               }
//             >
//               <SelectTrigger className="w-40">
//                 <SelectValue placeholder="All Priority" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="">All Priority</SelectItem>
//                 {Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => (
//                   <SelectItem key={value} value={value}>
//                     <div className="flex items-center gap-2">
//                       <div className={`w-2 h-2 rounded-full ${
//                         value === TaskPriority.HIGH ? 'bg-red-500' :
//                         value === TaskPriority.MEDIUM ? 'bg-orange-500' :
//                         'bg-gray-500'
//                       }`} />
//                       {label}
//                     </div>
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Sort By */}
//           <div className="flex items-center gap-2">
//             <ArrowUpDown className="w-4 h-4 text-gray-500" />
//             <Select
//               value={filters.sortBy || 'createdAt'}
//               onValueChange={(value) => 
//                 onFilterChange({ sortBy: value as any })
//               }
//             >
//               <SelectTrigger className="w-40">
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="createdAt">Created Date</SelectItem>
//                 <SelectItem value="dueDate">Due Date</SelectItem>
//                 <SelectItem value="priority">Priority</SelectItem>
//                 <SelectItem value="title">Title</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Sort Order */}
//           <Select
//             value={filters.sortOrder || 'desc'}
//             onValueChange={(value) => 
//               onFilterChange({ sortOrder: value as 'asc' | 'desc' })
//             }
//           >
//             <SelectTrigger className="w-32">
//               <SelectValue placeholder="Order" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="asc">Ascending</SelectItem>
//               <SelectItem value="desc">Descending</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Active Filters Display */}
//         {activeFiltersCount > 0 && (
//           <div className="flex items-center gap-2 flex-wrap">
//             <span className="text-sm text-gray-600">Active filters:</span>
            
//             {filters.search && (
//               <Badge variant="secondary" className="flex items-center gap-1">
//                 Search: "{filters.search}"
//                 <X 
//                   className="w-3 h-3 cursor-pointer hover:text-red-500" 
//                   onClick={() => onFilterChange({ search: '' })}
//                 />
//               </Badge>
//             )}
            
//             {filters.status && (
//               <Badge variant="secondary" className="flex items-center gap-1">
//                 Status: {TASK_STATUS_LABELS[filters.status]}
//                 <X 
//                   className="w-3 h-3 cursor-pointer hover:text-red-500" 
//                   onClick={() => onFilterChange({ status: undefined })}
//                 />
//               </Badge>
//             )}
            
//             {filters.priority && (
//               <Badge variant="secondary" className="flex items-center gap-1">
//                 Priority: {TASK_PRIORITY_LABELS[filters.priority]}
//                 <X 
//                   className="w-3 h-3 cursor-pointer hover:text-red-500" 
//                   onClick={() => onFilterChange({ priority: undefined })}
//                 />
//               </Badge>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };