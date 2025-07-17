import api from "./api";
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  TaskStats,
} from '../types/task.types';

export const taskService={
    getTasks: async(): Promise<Task[]> =>{
        const response = await api.get('/tasks');
        return response.data;
    },
    getTask: async (id:string): Promise<Task> =>{
        const response=await api.get(`/tasks/${id}`);
        return response.data;
    },

    createTask: async (data:CreateTaskRequest): Promise<Task> =>{
        const response=await api.post('/tasks',data);
        return response.data;
    },
    // updateTask: async(id:string, data:UpdateTaskRequest): Promise<Task> =>{
    //     const response=await api.put(`/tasks/${id}/status`,data);
    //     return response.data;
    // },
    updateTask: async(id:string, data:UpdateTaskRequest): Promise<Task> =>{
        const response=await api.put(`/tasks/${id}`,data);
        return response.data;
    },
    updateTaskStatus:async(id:string, data:UpdateTaskStatusRequest): Promise<Task> =>{
        const response=await api.patch(`/tasks/${id}/status`,data);
        return response.data;
    },
    deleteTask: async(id:string): Promise<void> =>{
        await api.delete(`/tasks/${id}`);
    },

    getTaskStatus:async(): Promise<TaskStats>=>{
    const response=await api.get('/tasks/stats');
    return response.data;
    },

} 