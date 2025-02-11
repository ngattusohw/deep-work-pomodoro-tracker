import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Easing,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import GreenClock from '../../assets/green_white.png'; // Update this path
import InnerClock from '../../assets/inner_clock.png'; // Update this path

export default function RotatingTimer() {
  const [isTiming, setIsTiming] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const animationValue = useRef(new Animated.Value(0)).current;
  const progressRef = useRef(0);
  const isFirstStart = useRef(true);
  const timerRef = useRef(null);
  const workTime = 1 * 60; // 25 mins in seconds
  const breakTime = 5 * 60; // 5 mins in seconds

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
      animationValue.stopAnimation(value => {
        progressRef.current = value;
      });
      setIsTiming(false);
    } else {
      if (isFirstStart.current) {
        // Initial start
        setTimeLeft(workTime);
        animationValue.setValue(0);
        isFirstStart.current = false;
        Animated.timing(animationValue, {
          toValue: 1,
          duration: workTime * 1000, // Convert seconds to milliseconds
          useNativeDriver: true,
          easing: Easing.linear,
        }).start(({ finished }) => {
          if (finished) {
            isFirstStart.current = true;
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
          }
        });

        // Start countdown
        timerRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        // Resume
        Animated.timing(animationValue, {
          toValue: 1,
          duration: timeLeft * 1000 * (1 - progressRef.current),
          useNativeDriver: true,
          easing: Easing.linear,
        }).start();

        // Resume countdown
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

  const combinedStyle = {
    transform: [
      {
        rotate: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['360deg', '0deg'],
        }),
      },
    ],
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
      <View style={styles.container}>
        <Animated.View style={[styles.box, combinedStyle]}>
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
    top: '68%', // Adjust this value to position the timer where you want
    zIndex: 1,
  },
  timerOverlay: {
    position: 'absolute',
    top: '80%', // Adjust this value to position the timer where you want
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
