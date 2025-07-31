import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Circle,
  ChevronDown,
  X,
  Save,
  Loader2
} from 'lucide-react';

// Import your actual types and services
import {
  type Task,
  type CreateTaskRequest,
  type UpdateTaskRequest,
  type TaskStats,
  type TaskFilters,
  TaskStatus,
  TaskPriority,
  TASK_STATUS_LABELS,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_COLORS,
  TASK_PRIORITY_COLORS,
} from '../../types/task.types';
import { useTasks } from '../../hooks/useTasks';

const TaskPage: React.FC = () => {
  const {
    loading,
    error,
    stats,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    filterTasks,
    clearError,
  } = useTasks();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | ''>('');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | ''>('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate' | 'priority' | 'title'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Clear error on component mount
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Filter and sort tasks using the hook
  const filteredTasks = useMemo(() => {
    const filters: TaskFilters = {
      search: searchTerm || undefined,
      status: filterStatus || undefined,
      priority: filterPriority || undefined,
      sortBy,
      sortOrder,
    };
    return filterTasks(filters);
  }, [filterTasks, searchTerm, filterStatus, filterPriority, sortBy, sortOrder]);

  const handleCreateTask = async (taskData: CreateTaskRequest | UpdateTaskRequest) => {
    try {
      await createTask(taskData as CreateTaskRequest);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

//   const handleCreateTask = async (taskData: CreateTaskRequest | UpdateTaskRequest) => {
//   try {
//     console.log('handleCreateTask called with:', taskData); // Debug log
//     await createTask(taskData as CreateTaskRequest);
//     console.log('Task created successfully, closing modal'); // Debug log
//     setIsCreateModalOpen(false);
//   } catch (err) {
//     console.error('Failed to create task:', err);
//     // Don't close modal on error so user can retry
//     // You might want to show an error message to the user here
//   }
// };
  const handleUpdateTask = async (taskData: UpdateTaskRequest) => {
    if (!selectedTask) return;
    
    try {
      await updateTask(selectedTask._id, taskData);
      setIsEditModalOpen(false);
      setSelectedTask(null);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

//   const handleUpdateTask = async (taskData: UpdateTaskRequest) => {
//   if (!selectedTask) return;
  
//   try {
//     console.log('handleUpdateTask called with:', taskData); // Debug log
//     await updateTask(selectedTask._id, taskData);
//     console.log('Task updated successfully, closing modal'); // Debug log
//     setIsEditModalOpen(false);
//     setSelectedTask(null);
//   } catch (err) {
//     console.error('Failed to update task:', err);
//     // Don't close modal on error so user can retry
//   }
// };
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return <Circle className="w-4 h-4 text-yellow-600" />;
      case TaskStatus.IN_PROGRESS:
        return <Clock className="w-4 h-4 text-blue-600" />;
      case TaskStatus.COMPLETED:
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (dueDate: Date | string | undefined) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    return due < now && due.toDateString() !== now.toDateString();
  };

  // Error display
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error loading tasks</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
            <button
              onClick={clearError}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-600 mt-1">Manage your learning goals and tasks</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Task Status Dropdown */}
            <TaskStatusDropdown 
              stats={stats}
              isOpen={isStatusDropdownOpen}
              onToggle={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              loading={loading}
            />
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Create Task
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TaskStatus | '')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as TaskPriority | '')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Priority</option>
              {Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as typeof sortBy);
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="dueDate-asc">Due Date (Soon)</option>
              <option value="dueDate-desc">Due Date (Later)</option>
              <option value="priority-desc">Priority (High)</option>
              <option value="priority-asc">Priority (Low)</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading tasks...</span>
          </div>
        )}

        {/* Task List */}
        {!loading && (
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <Circle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-500">
                  {searchTerm || filterStatus || filterPriority
                    ? 'Try adjusting your filters or search terms'
                    : 'Create your first task to get started'}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={() => {
                    setSelectedTask(task);
                    setIsEditModalOpen(true);
                  }}
                  onDelete={() => handleDeleteTask(task._id)}
                  onStatusChange={(status) => handleStatusChange(task._id, status)}
                  getStatusIcon={getStatusIcon}
                  formatDate={formatDate}
                  isOverdue={isOverdue}
                />
              ))
            )}
          </div>
        )}

        {/* Create Task Modal */}
        {isCreateModalOpen && (
          <TaskModal
            title="Create New Task"
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateTask}
          />
        )}

        {/* Edit Task Modal */}
        {isEditModalOpen && selectedTask && (
          <TaskModal
            title="Edit Task"
            task={selectedTask}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedTask(null);
            }}
            onSubmit={handleUpdateTask}
          />
        )}
      </div>
    </div>
  );
};

// Task Card Component
const TaskCard: React.FC<{
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: TaskStatus) => void;
  getStatusIcon: (status: TaskStatus) => React.ReactNode;
  formatDate: (date: Date | string) => string;
  isOverdue: (date: Date | string | undefined) => boolean;
}> = ({ 
  task, 
  onEdit, 
  onDelete, 
  onStatusChange, 
  getStatusIcon, 
  formatDate, 
  isOverdue 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {getStatusIcon(task.status)}
            <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${TASK_PRIORITY_COLORS[task.priority]}`}>
              {TASK_PRIORITY_LABELS[task.priority]}
            </span>
          </div>
          
          {task.description && (
            <p className="text-gray-600 mb-3">{task.description}</p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${TASK_STATUS_COLORS[task.status]}`}>
              {TASK_STATUS_LABELS[task.status]}
            </span>
            
            {task.dueDate && (
              <div className={`flex items-center gap-1 ${isOverdue(task.dueDate) ? 'text-red-600' : ''}`}>
                <Calendar className="w-4 h-4" />
                <span>Due: {formatDate(task.dueDate)}</span>
                {isOverdue(task.dueDate) && <AlertCircle className="w-4 h-4 text-red-600" />}
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Created: {formatDate(task.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Status Change Buttons */}
          <div className="flex items-center gap-1">
            {task.status !== TaskStatus.PENDING && (
              <button
                onClick={() => onStatusChange(TaskStatus.PENDING)}
                className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                title="Mark as Pending"
              >
                <Circle className="w-4 h-4" />
              </button>
            )}
            
            {task.status !== TaskStatus.IN_PROGRESS && (
              <button
                onClick={() => onStatusChange(TaskStatus.IN_PROGRESS)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Mark as In Progress"
              >
                <Clock className="w-4 h-4" />
              </button>
            )}
            
            {task.status !== TaskStatus.COMPLETED && (
              <button
                onClick={() => onStatusChange(TaskStatus.COMPLETED)}
                className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                title="Mark as Completed"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* More Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    onEdit();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Task
                </button>
                <button
                  onClick={() => {
                    onDelete();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Task
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Task Modal Component
// const TaskModal: React.FC<{
//   title: string;
//   task?: Task;
//   onClose: () => void;
//   onSubmit: (task: CreateTaskRequest | UpdateTaskRequest) => void;
// }> = ({ title, task, onClose, onSubmit }) => {
//   const [formData, setFormData] = useState({
//     title: task?.title || '',
//     description: task?.description || '',
//     priority: task?.priority || TaskPriority.MEDIUM,
//     dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
//   });

const TaskModal: React.FC<{
  title: string;
  task?: Task;
  onClose: () => void;
  onSubmit: (task: CreateTaskRequest | UpdateTaskRequest) => void;
}> = ({ title, task, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || TaskPriority.MEDIUM,
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
  });
   const [isSubmitting, setIsSubmitting] = useState(false);
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   const submitData = {
  //     title: formData.title,
  //     description: formData.description || undefined,
  //     priority: formData.priority,
  //     dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
  //   };

  //   onSubmit(submitData);
  // };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }
    
    // Basic validation
    if (!formData.title.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
//  const handleBackdropClick = (e: React.MouseEvent) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose])
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {task ? 'Update' : 'Create'} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Task Status Dropdown Component
const TaskStatusDropdown: React.FC<{
  stats: TaskStats;
  isOpen: boolean;
  onToggle: () => void;
  loading?: boolean;
}> = ({ stats, isOpen, onToggle, loading }) => {
  const statusItems = [
    {
      label: 'Pending',
      count: stats.pending,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      icon: <Circle className="w-4 h-4" />,
    },
    {
      label: 'In Progress',
      count: stats.inProgress,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      label: 'Completed',
      count: stats.completed,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: <CheckCircle className="w-4 h-4" />,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <span className="text-sm font-medium text-gray-700">
            Tasks ({stats.total})
          </span>
        )}
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && !loading && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800">Task Overview</h3>
          </div>
          
          <div className="p-2 space-y-1">
            {statusItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center justify-between px-3 py-2 rounded-md ${item.bgColor} hover:opacity-80 transition-opacity duration-200`}
              >
                <div className="flex items-center gap-2">
                  <span className={item.color}>{item.icon}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                </div>
                <span className={`text-sm font-bold ${item.color}`}>
                  {item.count}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                Total Tasks
              </span>
              <span className="text-sm font-bold text-gray-800">
                {stats.total}
              </span>
            </div>
          </div>

          {stats.total > 0 && (
            <div className="p-3 pt-0">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(stats.completed / stats.total) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Progress</span>
                <span>
                  {Math.round((stats.completed / stats.total) * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskPage;