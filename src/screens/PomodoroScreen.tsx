import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { useSession } from '../context/SessionContext';

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

export function PomodoroScreen() {
  const { session } = useSession();
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [distractionLevel, setDistractionLevel] = useState('5');
  const [distractionCount, setDistractionCount] = useState('0');
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveSession = async (completed: boolean) => {
    if (!session?.user || !sessionStartTime) return;

    try {
      const { error } = await supabase
        .from('pomodoro_sessions')
        .insert({
          user_id: session.user.id,
          start_time: sessionStartTime.toISOString(),
          end_time: new Date().toISOString(),
          duration_minutes: 25,
          status: completed ? 'completed' : 'interrupted',
          distraction_count: parseInt(distractionCount),
          notes: `Distraction Level: ${distractionLevel}/10`
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const resetTimer = useCallback(() => {
    setTimeLeft(isBreak ? BREAK_TIME : WORK_TIME);
    setIsActive(false);
  }, [isBreak]);

  const toggleTimer = () => {
    if (!isActive && !sessionStartTime) {
      setSessionStartTime(new Date());
    }
    setIsActive(!isActive);
  };

  const handleTimerComplete = () => {
    if (!isBreak) {
      setShowCompletionModal(true);
      setIsActive(false);
    } else {
      resetTimer();
      setIsBreak(false);
    }
  };

  const handleSessionComplete = async (completed: boolean) => {
    await saveSession(completed);
    setShowCompletionModal(false);
    setIsBreak(true);
    setTimeLeft(BREAK_TIME);
    setSessionStartTime(null);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{isBreak ? 'Break Time' : 'Focus Time'}</Text>
        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        
        <TouchableOpacity
          style={[styles.button, isActive ? styles.stopButton : styles.startButton]}
          onPress={toggleTimer}
        >
          <Text style={styles.buttonText}>
            {isActive ? 'Pause' : 'Start'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={resetTimer}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>

        <Modal
          visible={showCompletionModal}
          transparent={true}
          animationType="slide"
        >
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timer: {
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  resetButton: {
    backgroundColor: '#2196F3',
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