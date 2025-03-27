import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, SafeAreaView, Modal, TextInput } from 'react-native';
import { useTaskStore } from '@/stores/taskStore';
import { Plus, Trash2 } from 'lucide-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import DatePicker, { DateType } from 'react-native-ui-datepicker';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';

export default function TasksScreen() {
  const { tasks, isLoading, error, fetchTasks, createTask, deleteTask, updateTask } = useTaskStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [titre, onChangeTitre] = useState('');
  const [description, onChangeDescription] = useState('');
  const [limitedAt, onChangeLimitedAt] = useState<DateType>(dayjs());
  const [color, setColor] = useState('#fff');

  const onSelectColor = ({ hex }) => {
    'worklet';
    // do something with the selected color.
    setColor(hex);
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
    <GestureHandlerRootView>
      <View style={styles.container}>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Pressable
                onPress={() => updateTask(item.id, { completed: !item.completed })}
                style={styles.taskContent}>
                <Text style={[
                  styles.taskTitle,
                  item.completed && styles.completedTask
                ]}>
                  {item.title}
                </Text>
                <Text style={styles.taskDescription}>{item.description}</Text>
                <Text style={[styles.taskTitle,
                item.completed && styles.completedTask]}>Deadline: {item.limitedAt}</Text>
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
        <SafeAreaProvider>
          <SafeAreaView>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => { setModalVisible(!modalVisible) }}>
              <ScrollView>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Ajouter une tâche</Text>
                  <View style={styles.taskForm}>

                    <View style={styles.formField}>
                      <Text>Titre</Text>
                      <TextInput style={styles.textInput}
                        onChangeText={onChangeTitre}
                        value={titre}
                        placeholder='Entrez la description de la tâche...'>
                      </TextInput>
                    </View>

                    <View style={styles.formField}>
                      <Text>Description</Text>
                      <TextInput style={styles.textInput}
                        onChangeText={onChangeDescription}
                        value={description}
                        placeholder='Entrez la description de la tâche...'>
                      </TextInput>
                    </View>

                    <View style={styles.formField}>
                      <Text>Couleur</Text>
                      <ColorPicker style={{ width: '70%' }} value='white' onComplete={onSelectColor}>
                        <Preview />
                        <Panel1 />
                        <HueSlider />
                      </ColorPicker>
                    </View>

                    <View style={styles.formField}>
                      <Text>Deadline</Text>
                      <DatePicker
                        style={styles.datePicker}
                        mode="single"
                        minDate={Date.now()}
                        onChange={event => onChangeLimitedAt(dayjs(event.date))}
                        date={limitedAt}
                        styles={{
                          today: { borderColor: 'rgba(179, 208, 248, 0.77)', borderWidth: 2 },
                          selected: { backgroundColor: 'rgba(104, 209, 176, 0.84)' },
                          selected_label: { color: 'white' },
                          disabled: { opacity: .3 }
                        }}
                      />
                    </View>
                  </View>
                  <Pressable style={styles.formButton}
                    onPress={() => {
                      if (titre != '') {
                        createTask({
                          title: titre,
                          description: description,
                          completed: false,
                          limitedAt: limitedAt != undefined ? limitedAt?.toLocaleString('fr-FR') : '',
                          color: color
                        })
                      }
                      setModalVisible(!modalVisible)
                    }}
                  >AJOUTER</Pressable>
                </View>
              </ScrollView>
            </Modal>
          </SafeAreaView>
        </SafeAreaProvider>
        <Pressable
          onPress={() => setModalVisible(true)}
          style={styles.fab} testID='add-button'>
          <Plus size={24} color="#FFFFFF" />
        </Pressable>
      </View>
    </GestureHandlerRootView>
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
  modalContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    backgroundColor: 'rgba(179, 208, 248, 0.89)',
    padding: 30
  },
  modalTitle: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 24
  },
  taskForm: {
    display: 'flex',
    gap: 30,
    flexDirection: 'column',
    padding: 30
  },
  formField: {
    display: 'flex',
    gap: 15
  },
  textInput: {
    height: 50,
    width: 300,
    borderColor: '#fff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 7,
    paddingLeft: 10
  },
  datePicker: {
    backgroundColor: '#fff',
    height: 'auto',
    width: 300
  },
  formButton: {
    height: 'auto',
    width: 'auto',
    borderColor: '#fff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 7,
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: 'rgba(179, 208, 248, 0.98)',
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 4,
    color: 'rgba(179, 208, 248, 0.98)',
    fontWeight: 'bold'
  }
});