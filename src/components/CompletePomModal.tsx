import React from 'react';
import { View, Text, StyleSheet, Modal, Button } from 'react-native';
import Slider from '@react-native-community/slider';

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

          <Text style={styles.label}>Focus Level:</Text>
          <Slider
            step={1}
            tapToSeek
            minimumTrackTintColor={'#03540c'}
            maximumTrackTintColor={'#570211'}
            minimumValue={1}
            maximumValue={10}
            thumbTintColor={'#2196F3'}
            value={focusLevel}
            onValueChange={value => setFocusLevel(value)}
          />
          <View style={styles.modalButtons}>
            <Button
              title="Complete"
              style={[styles.button, styles.successButton]}
              onPress={() => handleSessionComplete(true)}
            />

            <Button
              style={[styles.button, styles.cancelButton]}
              title="Interrupted"
              onPress={() => handleSessionComplete(false)}
            />
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
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});
