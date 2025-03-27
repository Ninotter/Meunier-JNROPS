import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TasksScreen from '@/app/(tabs)/index';
import { useTaskStore } from '@/stores/taskStore';
import { Task } from '@/entity/Task';

// Mock du store
jest.mock('@/stores/taskStore');

describe('TasksScreen', () => {
  const mockTasks : Task[] = [
    { id: '1', title: 'Task 1', description: 'Description 1', completed: false, createdAt: '', updatedAt: '', limitedAt: '' },
    { id: '2', title: 'Task 2', description: 'Description 2', completed: true, createdAt: '', updatedAt: '', limitedAt: '' },
    { id: '3', title: 'Task 3', description: 'Description 3', completed: false,   createdAt: '', updatedAt: '', limitedAt: '' },
  ];

  it('affiche le message de chargement quand isLoading est vrai', () => {
    useTaskStore.mockReturnValue({
      tasks: [],
      isLoading: true,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
    });

    const { getByText } = render(<TasksScreen />);

    expect(getByText('Loading tasks...')).toBeTruthy();
  });

  it('affiche le message d\'erreur quand une erreur se produit', () => {
    useTaskStore.mockReturnValue({
      tasks: [],
      isLoading: false,
      error: 'Something went wrong!',
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
    });

    const { getByText } = render(<TasksScreen />);

    expect(getByText('Something went wrong!')).toBeTruthy();
  });

  it('affiche les tâches correctement', () => {
    useTaskStore.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
    });

    const { getByText } = render(<TasksScreen />);

    // Vérifie que les titres des tâches sont affichés
    expect(getByText('Task 1')).toBeTruthy();
    expect(getByText('Task 2')).toBeTruthy();
  });

  it('appelle la fonction updateTask lorsque l\'utilisateur appuie sur une tâche', () => {
    const mockUpdateTask = jest.fn();
    useTaskStore.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: mockUpdateTask,
    });

    const { getByText } = render(<TasksScreen />);

    // Simule un appui sur la première tâche
    fireEvent.press(getByText('Task 1'));

    // Vérifie que la fonction updateTask a été appelée
    expect(mockUpdateTask).toHaveBeenCalledWith('1', { completed: true });
  });

  it('appelle la fonction deleteTask lorsque l\'utilisateur appuie sur l\'icône de suppression', () => {
    const mockDeleteTask = jest.fn();
    useTaskStore.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: mockDeleteTask,
      updateTask: jest.fn(),
    });

    const { getByTestId } = render(<TasksScreen />);

    // Simule un appui sur l'icône de suppression pour la première tâche
    fireEvent.press(getByTestId('delete-button-1'));

    // Vérifie que la fonction deleteTask a été appelée
    expect(mockDeleteTask).toHaveBeenCalledWith('1');
  });

  it('affiche le bouton d\'ajout flottant', () => {
    const mockAddTask = jest.fn();
    useTaskStore.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
      addTask: mockAddTask,
    });

    const { getByTestId } = render(<TasksScreen />);

    // Vérifie que le bouton flottant est présent
    expect(getByTestId('add-button')).toBeTruthy();
  });

  it('Vérifier que le modal d\'ajout de tâches apparaît bien quand le bouton flottant est déclenché', () => {
    const mockAddTask = jest.fn();
    useTaskStore.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
      addTask: mockAddTask,
    });

    const { getByTestId } = render(<TasksScreen />);

    // Simule un appui sur le bouton flottant
    fireEvent.press(getByTestId('add-button'));

    // Vérifie que le modal d'ajout de tâches est présent
    expect(getByTestId('add-task-modal')).toBeTruthy();
  });
});
