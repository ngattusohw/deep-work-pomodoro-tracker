import React from 'react';
import { View, Text, StyleSheet, Modal, Button } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default function CompletePomModal({
  handleSessionComplete,
  showCompletionModal,
  setFocusLevel,
  focusLevel,
}) {
  return (
    <Modal
      visible={showCompletionModal}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Focus Session Complete</Text>

          <Text style={styles.label}>Focus Level (1-10):</Text>
          <RNPickerSelect
            value={focusLevel}
            onValueChange={value => setFocusLevel(value)}
            items={[
              { label: '1', value: '1' },
              { label: '2', value: '2' },
              { label: '3', value: '3' },
              { label: '4', value: '4' },
              { label: '5', value: '5' },
              { label: '6', value: '6' },
              { label: '7', value: '7' },
              { label: '8', value: '8' },
              { label: '9', value: '9' },
              { label: '10', value: '10' },
            ]}
          />

          <View style={styles.modalButtons}>
            <Button
              style={[styles.button, styles.successButton]}
              onPress={() => handleSessionComplete(true)}
            >
              <Text style={styles.buttonText}>Complete</Text>
            </Button>

            <Button
              style={[styles.button, styles.cancelButton]}
              onPress={() => handleSessionComplete(false)}
            >
              <Text style={styles.buttonText}>Interrupted</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});
