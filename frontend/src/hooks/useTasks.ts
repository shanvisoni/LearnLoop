// import { useState, useEffect, useCallback } from 'react';
// import { taskService } from '../services/task.service';
// import {
//   type Task,
//   type CreateTaskRequest,
//   type UpdateTaskRequest,
//   type TaskStats,
//   type TaskFilters,
//   TaskStatus,
//   type TaskPriority,
// } from '../types/task.types';

// export const useTasks = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [stats, setStats] = useState<TaskStats>({
//     total: 0,
//     pending: 0,
//     inProgress: 0,
//     completed: 0,
//   });

//   // Helper function to extract error message
//   const extractErrorMessage = (err: unknown): string => {
//     if (err instanceof Error) {
//       return err.message;
//     }
//     if (typeof err === 'object' && err !== null) {
//       const apiError = err as any;
//       if (apiError.response?.data?.message) {
//         return apiError.response.data.message;
//       }
//       if (apiError.message) {
//         return apiError.message;
//       }
//     }
//     return 'An unexpected error occurred';
//   };

//   // Fetch all tasks
//   const fetchTasks = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       console.log('Fetching tasks...'); // Debug log
      
//       const data = await taskService.getTasks();
//       console.log('Tasks fetched successfully:', data); // Debug log
      
//       setTasks(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error('Fetch tasks error:', err);
//       const errorMessage = extractErrorMessage(err);
//       setError(`Failed to fetch tasks: ${errorMessage}`);
//       setTasks([]); // Reset to empty array on error
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fetch task statistics
//   const fetchStats = useCallback(async () => {
//     try {
//       console.log('Fetching task stats...'); // Debug log
      
//       const data = await taskService.getTaskStatus();
//       console.log('Task stats fetched successfully:', data); // Debug log
      
//       // Validate stats data structure
//       if (typeof data === 'object' && data !== null) {
//         setStats({
//           total: Number(data.total) || 0,
//           pending: Number(data.pending) || 0,
//           inProgress: Number(data.inProgress) || 0,
//           completed: Number(data.completed) || 0,
//         });
//       } else {
//         console.warn('Invalid stats data received:', data);
//         setStats({
//           total: 0,
//           pending: 0,
//           inProgress: 0,
//           completed: 0,
//         });
//       }
//     } catch (err) {
//       console.error('Failed to fetch task stats:', err);
//       // Don't set error state for stats failure, just log it
//       // Keep default stats values
//       setStats({
//         total: 0,
//         pending: 0,
//         inProgress: 0,
//         completed: 0,
//       });
//     }
//   }, []);

//   // Create a new task
//   const createTask = useCallback(async (data: CreateTaskRequest): Promise<Task> => {
//     try {
//       console.log('Creating task with data:', data);
      
//       // Validate required fields
//       if (!data.title?.trim()) {
//         throw new Error('Task title is required');
//       }

//       // Clean up the data
//       const cleanData: CreateTaskRequest = {
//         title: data.title.trim(),
//         description: data.description?.trim() || undefined,
//         priority: data.priority,
//         dueDate: data.dueDate,
//       };

//       const newTask = await taskService.createTask(cleanData);
//       console.log('Task created successfully:', newTask);
      
//       // Update local state
//       setTasks(prev => [newTask, ...prev]);
      
//       // Refresh stats in background
//       fetchStats();
      
//       // Clear any existing errors
//       setError(null);
      
//       return newTask;
//     } catch (err) {
//       console.error('Create task error:', err);
//       const errorMessage = extractErrorMessage(err);
//       setError(`Failed to create task: ${errorMessage}`);
//       throw new Error(errorMessage);
//     }
//   }, [fetchStats]);

//   // Update a task
//   const updateTask = useCallback(async (id: string, data: UpdateTaskRequest): Promise<Task> => {
//     try {
//       console.log('Updating task:', id, data);
      
//       if (!id) {
//         throw new Error('Task ID is required');
//       }

//       const updatedTask = await taskService.updateTask(id, data);
//       console.log('Task updated successfully:', updatedTask);
      
//       // Update local state
//       setTasks(prev => prev.map(task => 
//         task._id === id ? updatedTask : task
//       ));
      
//       // Refresh stats in background
//       fetchStats();
      
//       // Clear any existing errors
//       setError(null);
      
//       return updatedTask;
//     } catch (err) {
//       console.error('Update task error:', err);
//       const errorMessage = extractErrorMessage(err);
//       setError(`Failed to update task: ${errorMessage}`);
//       throw new Error(errorMessage);
//     }
//   }, [fetchStats]);

//   // Update task status
//   const updateTaskStatus = useCallback(async (id: string, status: TaskStatus): Promise<Task> => {
//     try {
//       console.log('Updating task status:', id, status);
      
//       if (!id) {
//         throw new Error('Task ID is required');
//       }

//       const updatedTask = await taskService.updateTaskStatus(id, { status });
//       console.log('Task status updated successfully:', updatedTask);
      
//       // Update local state
//       setTasks(prev => prev.map(task => 
//         task._id === id ? updatedTask : task
//       ));
      
//       // Refresh stats in background
//       fetchStats();
      
//       // Clear any existing errors
//       setError(null);
      
//       return updatedTask;
//     } catch (err) {
//       console.error('Update task status error:', err);
//       const errorMessage = extractErrorMessage(err);
//       setError(`Failed to update task status: ${errorMessage}`);
//       throw new Error(errorMessage);
//     }
//   }, [fetchStats]);

//   // Delete a task
//   const deleteTask = useCallback(async (id: string): Promise<void> => {
//     try {
//       console.log('Deleting task:', id);
      
//       if (!id) {
//         throw new Error('Task ID is required');
//       }

//       await taskService.deleteTask(id);
//       console.log('Task deleted successfully');
      
//       // Update local state
//       setTasks(prev => prev.filter(task => task._id !== id));
      
//       // Refresh stats in background
//       fetchStats();
      
//       // Clear any existing errors
//       setError(null);
//     } catch (err) {
//       console.error('Delete task error:', err);
//       const errorMessage = extractErrorMessage(err);
//       setError(`Failed to delete task: ${errorMessage}`);
//       throw new Error(errorMessage);
//     }
//   }, [fetchStats]);

//   // Filter and sort tasks
//   const filterTasks = useCallback((filters: TaskFilters) => {
//     try {
//       let filtered = [...tasks];

//       // Filter by status
//       if (filters.status) {
//         filtered = filtered.filter(task => task.status === filters.status);
//       }

//       // Filter by priority
//       if (filters.priority) {
//         filtered = filtered.filter(task => task.priority === filters.priority);
//       }

//       // Filter by search term
//       if (filters.search?.trim()) {
//         const searchTerm = filters.search.toLowerCase().trim();
//         filtered = filtered.filter(task => 
//           task.title.toLowerCase().includes(searchTerm) ||
//           task.description?.toLowerCase().includes(searchTerm)
//         );
//       }

//       // Sort tasks
//       if (filters.sortBy) {
//         filtered.sort((a, b) => {
//           let aValue: any;
//           let bValue: any;

//           switch (filters.sortBy) {
//             case 'createdAt':
//               aValue = new Date(a.createdAt).getTime();
//               bValue = new Date(b.createdAt).getTime();
//               break;
//             case 'dueDate':
//               aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
//               bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
//               break;
//             case 'priority':
//               const priorityOrder = { high: 3, medium: 2, low: 1 };
//               aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
//               bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
//               break;
//             case 'title':
//               aValue = a.title.toLowerCase();
//               bValue = b.title.toLowerCase();
//               break;
//             default:
//               return 0;
//           }

//           if (filters.sortOrder === 'desc') {
//             return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
//           } else {
//             return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
//           }
//         });
//       }

//       return filtered;
//     } catch (err) {
//       console.error('Error filtering tasks:', err);
//       return tasks; // Return original tasks if filtering fails
//     }
//   }, [tasks]);

//   // Get tasks by status
//   const getTasksByStatus = useCallback((status: TaskStatus) => {
//     return tasks.filter(task => task.status === status);
//   }, [tasks]);

//   // Get tasks by priority
//   const getTasksByPriority = useCallback((priority: TaskPriority) => {
//     return tasks.filter(task => task.priority === priority);
//   }, [tasks]);

//   // Get overdue tasks
//   const getOverdueTasks = useCallback(() => {
//     const now = new Date();
//     return tasks.filter(task => 
//       task.dueDate && 
//       new Date(task.dueDate) < now && 
//       task.status !== TaskStatus.COMPLETED
//     );
//   }, [tasks]);

//   // Initialize data with proper error handling
//   useEffect(() => {
//     let isMounted = true;

//     const initializeData = async () => {
//       try {
//         console.log('Initializing task data...');
        
//         // Fetch tasks first
//         if (isMounted) {
//           await fetchTasks();
//         }
        
//         // Then fetch stats
//         if (isMounted) {
//           await fetchStats();
//         }
        
//         console.log('Task data initialization completed');
//       } catch (err) {
//         console.error('Error during data initialization:', err);
//         if (isMounted) {
//           setError('Failed to initialize task data');
//           setLoading(false);
//         }
//       }
//     };

//     initializeData();

//     return () => {
//       isMounted = false;
//     };
//   }, []); // Remove fetchTasks and fetchStats from dependencies to avoid infinite loops

//   // Clear error function
//   const clearError = useCallback(() => {
//     setError(null);
//   }, []);

//   // Retry function
//   const retry = useCallback(async () => {
//     setError(null);
//     setLoading(true);
//     try {
//       await fetchTasks();
//       await fetchStats();
//     } catch (err) {
//       console.error('Retry failed:', err);
//     }
//   }, [fetchTasks, fetchStats]);

//   return {
//     tasks,
//     loading,
//     error,
//     stats,
//     createTask,
//     updateTask,
//     updateTaskStatus,
//     deleteTask,
//     fetchTasks,
//     fetchStats,
//     filterTasks,
//     getTasksByStatus,
//     getTasksByPriority,
//     getOverdueTasks,
//     clearError,
//     retry,
//   };
// };






import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/task.service';
import {
  type Task,
  type CreateTaskRequest,
  type UpdateTaskRequest,
  type TaskStats,
  type TaskFilters,
  TaskStatus,
  type TaskPriority,
} from '../types/task.types';
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });
  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Fetch tasks error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);
  // Fetch task statistics
  const fetchStats = useCallback(async () => {
    try {
      const data = await taskService.getTaskStatus();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch task stats:', err);
    }
  }, []);
  // Create a new task - FIXED ERROR HANDLING
  const createTask = useCallback(async (data: CreateTaskRequest) => {
    try {
      console.log('Creating task with data:', data); // Debug log
      const newTask = await taskService.createTask(data);
      console.log('Task created successfully:', newTask); // Debug log

      setTasks(prev => [newTask, ...prev]);
      await fetchStats(); // Update stats after creating
      return newTask;
    } catch (err) {
      console.error('Create task error:', err); // More detailed error logging

      // More detailed error message extraction
      let errorMessage = 'Failed to create task';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        // Handle API response errors
        const apiError = err as any;
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      }

      setError(errorMessage);
      throw new Error(errorMessage); // Re-throw with proper error message
    }
  }, [fetchStats]);
  // Update a task
  const updateTask = useCallback(async (id: string, data: UpdateTaskRequest) => {
    try {
      const updatedTask = await taskService.updateTask(id, data);
      setTasks(prev => prev.map(task => 
        task._id === id ? updatedTask : task
      ));
      await fetchStats(); // Update stats after updating
      return updatedTask;
    } catch (err) {
      console.error('Update task error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    }
  }, [fetchStats]);
  // Update task status
  const updateTaskStatus = useCallback(async (id: string, status: TaskStatus) => {
    try {
      const updatedTask = await taskService.updateTaskStatus(id, { status });
      setTasks(prev => prev.map(task => 
        task._id === id ? updatedTask : task
      ));
      await fetchStats(); // Update stats after status change
      return updatedTask;
    } catch (err) {
      console.error('Update task status error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update task status');
      throw err;
    }
  }, [fetchStats]);
  // Delete a task
  const deleteTask = useCallback(async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
      await fetchStats(); // Update stats after deleting
    } catch (err) {
      console.error('Delete task error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    }
  }, [fetchStats]);
  // Filter and sort tasks
  const filterTasks = useCallback((filters: TaskFilters) => {
    let filtered = [...tasks];
    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }
    // Filter by priority
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        task.description?.toLowerCase().includes(searchTerm)
      );
    }
    // Sort tasks
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;
        switch (filters.sortBy) {
          case 'createdAt':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case 'dueDate':
            aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
            bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
            break;
          case 'priority':
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
            bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
            break;
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          default:
            return 0;
        }
        if (filters.sortOrder === 'desc') {
          return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
        } else {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        }
      });
    }
    return filtered;
  }, [tasks]);
  // Get tasks by status
  const getTasksByStatus = useCallback((status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);
  // Get tasks by priority
  const getTasksByPriority = useCallback((priority: TaskPriority) => {
    return tasks.filter(task => task.priority === priority);
  }, [tasks]);
  // Get overdue tasks
  const getOverdueTasks = useCallback(() => {
    const now = new Date();
    return tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < now && 
      task.status !== TaskStatus.COMPLETED
    );
  }, [tasks]);
  // Initialize data
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);
  return {
    tasks,
    loading,
    error,
    stats,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    fetchTasks,
    fetchStats,
    filterTasks,
    getTasksByStatus,
    getTasksByPriority,
    getOverdueTasks,
    clearError: () => setError(null),
  };
};










