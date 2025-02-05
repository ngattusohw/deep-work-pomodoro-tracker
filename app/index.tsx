import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CompletePomModal from '../src/components/CompletePomModal';
import Timer from '../src/components/Timer';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/lib/supabase';

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

export default function TimerScreen() {
  const { session } = useAuth();
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [restartKey, setRestartKey] = useState(1);
  const [isBreak, setIsBreak] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [focusLevel, setFocusLevel] = useState(6);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const saveSession = async (completed: boolean) => {
    console.log('saving session');
    if (!session?.user || !sessionStartTime) return;
    console.log('session user', session.user);

    try {
      let duration_minutes = Math.floor(
        (new Date().getTime() - sessionStartTime.getTime()) / 60000
      );
      console.log('duration minutes', duration_minutes);

      if (duration_minutes > 0) {
        const { error } = await supabase.from('pomodoro_sessions').insert({
          user_id: session.user.id,
          start_time: sessionStartTime.toISOString(),
          end_time: new Date().toISOString(),
          duration_minutes,
          status: completed ? 'completed' : 'interrupted',
          notes: `${isBreak ? 'Break' : 'Focus'} - Level: ${focusLevel}/10`,
        });
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving session:', error);
      Alert.alert('Error', 'Failed to save session.');
    }

    console.log('session saved');
  };

  const resetTimer = () => {
    setRestartKey(restartKey + 1);
    setIsActive(false);
  };

  const toggleTimer = () => {
    if (!isActive && !sessionStartTime) {
      setSessionStartTime(new Date());
    }
    setIsActive(!isActive);
  };

  const handleTimerComplete = () => {
    setShowCompletionModal(true);
    setIsActive(false);
  };

  const handleSessionComplete = async (completed: boolean) => {
    // TOOD submit the data from the modal - make sure to do 11-focusLevel
    await saveSession(completed);
    setShowCompletionModal(false);
    setIsBreak(!isBreak);
    setSessionStartTime(null);
    resetTimer();
  };

  useEffect(() => {
    setTimeLeft(isBreak ? BREAK_TIME : WORK_TIME);
  }, [isBreak]);

  return (
    <View style={styles.container}>
      {session?.user && <Text style={styles.title}>{session.user.email}</Text>}
      <Text style={styles.title}>{isBreak ? 'Break Time' : 'Focus Time'}</Text>
      <Timer
        handleTimerComplete={handleTimerComplete}
        timeLeft={timeLeft}
        isPlaying={isActive}
        restartKey={restartKey}
      />
      {!isActive ? (
        <TouchableOpacity
          style={[styles.button, styles.startButton]}
          onPress={toggleTimer}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.buttonHalf, styles.stopButton]}
            onPress={toggleTimer}
          >
            <Text style={styles.buttonText}>⏸️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonHalf, styles.finishButton]}
            onPress={handleTimerComplete}
          >
            <Text style={styles.buttonText}>Finish Early</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, styles.resetButton]}
        onPress={resetTimer}
      >
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.resetButton]}
        onPress={() => setIsBreak(!isBreak)}
      >
        <Text style={styles.buttonText}>Switch Modes</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={[styles.button, styles.resetButton]}
        onPress={() => handleSessionComplete(true)} // TODO add this to complete timer logic
      >
        <Text style={styles.buttonText}>Test supabase</Text>
      </TouchableOpacity> */}

      <CompletePomModal
        handleSessionComplete={handleSessionComplete}
        showCompletionModal={showCompletionModal}
        setFocusLevel={setFocusLevel}
        focusLevel={focusLevel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  buttonHalf: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    width: '48%', // Leave small gap between buttons
    alignItems: 'center',
  },
  finishButton: {
    backgroundColor: '#FF9800', // Orange color for finish early
  },
});
