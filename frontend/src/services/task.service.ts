import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  TaskStats,
} from '../types/task.types';
import { apiHelper } from "./api-helper";
export const taskService={
    getTasks: async(): Promise<Task[]> => apiHelper.get<Task[]>('/tasks'),

    getTask: (id: string): Promise<Task> => 
    apiHelper.get<Task>(`/tasks/${id}`),

  createTask: (data: CreateTaskRequest): Promise<Task> => 
    apiHelper.post<Task>('/tasks', data),

  updateTask: (id: string, data: UpdateTaskRequest): Promise<Task> => 
    apiHelper.put<Task>(`/tasks/${id}`, data),

  updateTaskStatus: (id: string, data: UpdateTaskStatusRequest): Promise<Task> => 
    apiHelper.patch<Task>(`/tasks/${id}/status`, data),

  deleteTask: (id: string): Promise<void> => 
    apiHelper.delete(`/tasks/${id}`),

  getTaskStatus: (): Promise<TaskStats> => 
    apiHelper.get<TaskStats>('/tasks/stats'),

} 