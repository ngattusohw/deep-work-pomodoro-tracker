import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';

export default function CompletePomModal({handleSessionComplete, showCompletionModal, setDistractionLevel, distractionLevel, distractionCount, setDistractionCount}) {

  return (
      <Modal visible={showCompletionModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Session Complete!</Text>

            <Text style={styles.label}>Distraction Level (1-10):</Text>
            <TextInput
              style={styles.input}
              value={distractionLevel}
              onChangeText={setDistractionLevel}
              keyboardType="numeric"
              maxLength={2}
            />

            <Text style={styles.label}>Number of Distractions:</Text>
            <TextInput
              style={styles.input}
              value={distractionCount}
              onChangeText={setDistractionCount}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.successButton]}
                onPress={() => handleSessionComplete(true)}
              >
                <Text style={styles.buttonText}>Complete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => handleSessionComplete(false)}
              >
                <Text style={styles.buttonText}>Interrupted</Text>
              </TouchableOpacity>
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
