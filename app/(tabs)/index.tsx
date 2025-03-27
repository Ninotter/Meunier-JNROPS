import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useTaskStore } from '@/stores/taskStore';
import { Plus, Trash2 } from 'lucide-react-native';

export default function TasksScreen() {
  const { tasks, isLoading, error, fetchTasks, deleteTask, updateTask } = useTaskStore();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedItems((prev: string[]) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  
  const deleteSelectedItems = () => {
    selectedItems.forEach((id: string) => deleteTask(id));
    setSelectedItems([]);
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.taskItem}>
          <Pressable
            onPress={() => toggleSelection(item.id)}
            style={styles.checkboxContainer}>
            <View style={[
              styles.checkbox,
              selectedItems.includes(item.id) && styles.checkboxSelected
            ]} />
          </Pressable>
          <Pressable
            onPress={() => updateTask(item.id, { completed: !item.completed })}
            onLongPress={() => toggleSelection(item.id)}
            style={styles.taskContent}>
            <Text style={[
              styles.taskTitle,
              item.completed && styles.completedTask
            ]}>
              {item.title}
            </Text>
            <Text style={styles.taskDescription}>{item.description}</Text>
            <Text style={[
              styles.taskTitle,
              item.completed && styles.completedTask
            ]}>
              Deadline: {item.limitedAt}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => deleteTask(item.id)}
            testID={`delete-button-${item.id}`}
            style={styles.deleteButton}>
            <Trash2 size={20} color="#FF3B30" />
          </Pressable>
        </View>
      )}
      />
      <Pressable
      style={styles.fab}
      testID='add-button'>
      <Plus size={24} color="#FFFFFF" />
      </Pressable>
      {selectedItems.length > 0 && (
      <Pressable
        style={styles.deleteSelectedButton}
        onPress={deleteSelectedItems}>
        <Text style={styles.deleteSelectedText}>Delete Selected</Text>
      </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  taskDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 16,
  },
  deleteSelectedButton: {
    position: 'absolute',
    bottom: 90,
    right: 24,
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  deleteSelectedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  checkboxContainer: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#8E8E93',
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
  },
});
