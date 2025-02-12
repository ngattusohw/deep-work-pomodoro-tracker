import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import GreenClock from '../../assets/green_white.png';
import InnerClock from '../../assets/inner_clock.png';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

export default function RotatingTimer() {
  const WORK = 5;
  const BREAK = 5;
  const workTime = WORK * 60; // 25 mins in seconds
  const breakTime = BREAK * 60; // 5 mins in seconds
  const [isTiming, setIsTiming] = useState(false);
  const [timeLeft, setTimeLeft] = useState(WORK * 60); // 25 minutes in seconds
  const isFirstStart = useRef(true);
  const timerRef = useRef(null);
  const rotation = useSharedValue(361 - (WORK * 360) / 60); // initial angle slightly off
  const savedRotation = useSharedValue(361 - (WORK * 360) / 60);

  const rotationGesture = Gesture.Rotation()
    .onUpdate(e => {
      rotation.value = savedRotation.value + e.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  useEffect(() => {
    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleTimer = () => {
    if (isTiming) {
      // Pause
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      cancelAnimation(rotation);
      setIsTiming(false);
    } else {
      rotation.value = withTiming(
        360,
        {
          duration: workTime * 1000, // TODO make this work or break time
          easing: Easing.linear,
        },
        finished => {
          if (finished) {
            rotation.value = 0;
          }
        }
      );
      if (isFirstStart.current) {
        setTimeLeft(workTime);
        timerRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        isFirstStart.current = false;
      } else {
        timerRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
      setIsTiming(true);
    }
  };

  const handleReset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    isFirstStart.current = true;
    cancelAnimation(rotation);
    setIsTiming(false);
    rotation.value = 361 - (WORK * 360) / 60;
    setTimeLeft(WORK * 60);
  };

  return (
    <View>
      <TouchableOpacity
        style={{
          paddingHorizontal: 30,
          paddingVertical: 15,
          borderRadius: 25,
          marginVertical: 10,
          minWidth: 200,
          alignItems: 'center',
          backgroundColor: '#4CAF50',
        }}
        onPress={handleTimer}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          {isFirstStart.current ? 'Start' : isTiming ? 'Pause' : 'Resume'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          paddingHorizontal: 30,
          paddingVertical: 15,
          borderRadius: 25,
          marginVertical: 10,
          minWidth: 200,
          alignItems: 'center',
          backgroundColor: 'blue',
        }}
        onPress={handleReset}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          Reset
        </Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <Animated.View style={[styles.box, animatedStyle]}>
          <Animated.Image
            source={GreenClock}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
          />
        </Animated.View>
        <Image style={styles.innerClock} source={InnerClock} />

        <View style={styles.timerOverlay}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  box: {
    width: 600,
    height: 600,
    position: 'absolute',
    top: '40%',
  },
  innerClock: {
    width: 270,
    height: 270,
    position: 'absolute',
    top: '68%',
    zIndex: 1,
  },
  timerOverlay: {
    position: 'absolute',
    top: '80%',
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
});
