// import React, { useState, useEffect } from 'react';
// import { X, Loader2, Calendar, Type, FileText, Flag } from 'lucide-react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { 
//   type Task, 
//   TaskPriority, 
//   type CreateTaskRequest,
//   TASK_PRIORITY_LABELS 
// } from '../../types/task.types';

// interface TaskModalProps {
//   title: string;
//   task?: Task;
//   onClose: () => void;
//   onSubmit: (data: CreateTaskRequest) => void;
//   isLoading?: boolean;
// }

// export const TaskModal: React.FC<TaskModalProps> = ({
//   title,
//   task,
//   onClose,
//   onSubmit,
//   isLoading = false
// }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     priority: TaskPriority.MEDIUM,
//     dueDate: '',
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // Initialize form data
//   useEffect(() => {
//     if (task) {
//       setFormData({
//         title: task.title || '',
//         description: task.description || '',
//         priority: task.priority || TaskPriority.MEDIUM,
//         dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
//       });
//     }
//   }, [task]);

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.title.trim()) {
//       newErrors.title = 'Title is required';
//     } else if (formData.title.length < 3) {
//       newErrors.title = 'Title must be at least 3 characters';
//     } else if (formData.title.length > 100) {
//       newErrors.title = 'Title must be less than 100 characters';
//     }

//     if (formData.description && formData.description.length > 500) {
//       newErrors.description = 'Description must be less than 500 characters';
//     }

//     if (formData.dueDate) {
//       const dueDate = new Date(formData.dueDate);
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
      
//       if (dueDate < today) {
//         newErrors.dueDate = 'Due date cannot be in the past';
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     const submitData: CreateTaskRequest = {
//       title: formData.title.trim(),
//       description: formData.description.trim() || undefined,
//       priority: formData.priority,
//       dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
//     };

//     onSubmit(submitData);
//   };

//   const handleChange = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }));
//     }
//   };

//   return (
//     <Dialog open={true} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Type className="w-5 h-5" />
//             {title}
//           </DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Title Field */}
//           <div className="space-y-2">
//             <Label htmlFor="title" className="text-sm font-medium">
//               Task Title <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="title"
//               value={formData.title}
//               onChange={(e) => handleChange('title', e.target.value)}
//               placeholder="Enter task title..."
//               className={errors.title ? 'border-red-300 focus:border-red-500' : ''}
//               disabled={isLoading}
//             />
//             {errors.title && (
//               <p className="text-sm text-red-600">{errors.title}</p>
//             )}
//           </div>

//           {/* Description Field */}
//           <div className="space-y-2">
//             <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
//               <FileText className="w-4 h-4" />
//               Description
//             </Label>
//             <Textarea
//               id="description"
//               value={formData.description}
//               onChange={(e) => handleChange('description', e.target.value)}
//               placeholder="Enter task description..."
//               rows={4}
//               className={errors.description ? 'border-red-300 focus:border-red-500' : ''}
//               disabled={isLoading}
//             />
//             {errors.description && (
//               <p className="text-sm text-red-600">{errors.description}</p>
//             )}
//             <p className="text-xs text-gray-500">
//               {formData.description.length}/500 characters
//             </p>
//           </div>

//           {/* Priority Field */}
//           <div className="space-y-2">
//             <Label htmlFor="priority" className="text-sm font-medium flex items-center gap-2">
//               <Flag className="w-4 h-4" />
//               Priority
//             </Label>
//             <Select
//               value={formData.priority}
//               onValueChange={(value) => handleChange('priority', value)}
//               disabled={isLoading}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select priority" />
//               </SelectTrigger>
//               <SelectContent>
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

//           {/* Due Date Field */}
//           <div className="space-y-2">
//             <Label htmlFor="dueDate" className="text-sm font-medium flex items-center gap-2">
//               <Calendar className="w-4 h-4" />
//               Due Date
//             </Label>
//             <Input
//               id="dueDate"
//               type="date"
//               value={formData.dueDate}
//               onChange={(e) => handleChange('dueDate', e.target.value)}
//               className={errors.dueDate ? 'border-red-300 focus:border-red-500' : ''}
//               disabled={isLoading}
//               min={new Date().toISOString().split('T')[0]}
//             />
//             {errors.dueDate && (
//               <p className="text-sm text-red-600">{errors.dueDate}</p>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex items-center gap-3 pt-4">
//             <Button
//               type="submit"
//               disabled={isLoading}
//               className="flex-1"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                   {task ? 'Updating...' : 'Creating...'}
//                 </>
//               ) : (
//                 task ? 'Update Task' : 'Create Task'
//               )}
//             </Button>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onClose}
//               disabled={isLoading}
//               className="flex-1"
//             >
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };