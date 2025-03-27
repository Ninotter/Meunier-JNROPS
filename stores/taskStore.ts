import { create } from 'zustand';
import { TasksAPI } from '@/lib/api';
import { TaskStore } from '@/entity/TaskStore';

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await TasksAPI.getTasks();
      set({ tasks: response.data });
    } catch  {
      set({ error: 'Failed to fetch tasks' });
    } finally {
      set({ isLoading: false });
    }
  },
  createTask: async (task) => {
    set({ isLoading: true, error: null });
    try {
      const response = await TasksAPI.createTask(task);
      set({ tasks: [...get().tasks, response.data] });
    } catch {
      set({ error: 'Failed to create task' });
    } finally {
      set({ isLoading: false });
    }
  },
  updateTask: async (id, task) => {
    set({ isLoading: true, error: null });
    try {
      const response = await TasksAPI.updateTask(id, task);
      set({
        tasks: get().tasks.map((t) => (t.id === id ? response.data : t)),
      });
    } catch  {
      set({ error: 'Failed to update task' });
    } finally {
      set({ isLoading: false });
    }
  },
  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await TasksAPI.deleteTask(id);
      set({ tasks: get().tasks.filter((t) => t.id !== id) });
    } catch  {
      set({ error: 'Failed to delete task' });
    } finally {
      set({ isLoading: false });
    }
  },
}));