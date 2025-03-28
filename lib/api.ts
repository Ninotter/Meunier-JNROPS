import { Task } from '@/entity/Task';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const TasksAPI = {
  getTasks: () => api.get<Task[]>('/tasks'),
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'limitedAt'>) => 
    api.post<Task>('/tasks', task),
  updateTask: (id: string, task: Partial<Task>) => 
    api.patch<Task>(`/tasks/${id}`, task),
  deleteTask: (id: string) => api.delete(`/tasks/${id}`),
};

export default api;