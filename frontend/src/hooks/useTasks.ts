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

  // Create a new task
  const createTask = useCallback(async (data: CreateTaskRequest) => {
    try {
      const newTask = await taskService.createTask(data);
      setTasks(prev => [newTask, ...prev]);
      fetchStats(); // Update stats after creating
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    }
  }, [fetchStats]);

  // Update a task
  const updateTask = useCallback(async (id: string, data: UpdateTaskRequest) => {
    try {
      const updatedTask = await taskService.updateTask(id, data);
      setTasks(prev => prev.map(task => 
        task._id === id ? updatedTask : task
      ));
      fetchStats(); // Update stats after updating
      return updatedTask;
    } catch (err) {
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
      fetchStats(); // Update stats after status change
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task status');
      throw err;
    }
  }, [fetchStats]);

  // Delete a task
  const deleteTask = useCallback(async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
      fetchStats(); // Update stats after deleting
    } catch (err) {
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