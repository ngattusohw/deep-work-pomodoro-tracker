import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Easing,
  Text,
  TouchableOpacity,
  Image,
  PanResponder,
  Dimensions,
} from 'react-native';
import GreenClock from '../../assets/green_white.png';
import InnerClock from '../../assets/inner_clock.png';

export default function RotatingTimer() {
  const workTime = 25 * 60;
  const maxTime = 60 * 60;
  const breakTime = 5 * 60;
  const [isTiming, setIsTiming] = useState(false);
  const defaultProgress = workTime / maxTime;
  const [timeLeft, setTimeLeft] = useState(workTime);
  const animationValue = useRef(new Animated.Value(defaultProgress)).current;
  const progressRef = useRef(defaultProgress);
  const isFirstStart = useRef(true);
  const timerRef = useRef(null);

  // Add refs for smooth rotation
  const lastRotation = useRef(-((1 - defaultProgress) * 360));
  const startRotation = useRef(0);
  const viewRef = useRef(null);
  const layoutRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Throttle helper to smooth out rapid movements
  const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  // Enhanced angle calculation with normalization and stability checks
  const calculateAngle = (x, y, center) => {
    const deltaX = x - center.x;
    const deltaY = y - center.y;

    // Calculate distance from center to detect erratic movements
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const minDistance = 20; // Minimum distance to register movement

    if (distance < minDistance) {
      // Return the last stable angle if too close to center
      return (lastRotation.current * Math.PI) / 180;
    }

    const angle = Math.atan2(deltaY, deltaX);
    return angle;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        if (isTiming) return;

        const { locationX, locationY } = evt.nativeEvent;
        const center = {
          x: layoutRef.current.width / 2,
          y: layoutRef.current.height / 2,
        };

        startRotation.current = calculateAngle(locationX, locationY, center);
        lastRotation.current = getCurrentRotation();
      },
      onPanResponderMove: throttle((evt, gestureState) => {
        if (isTiming) return;

        const { locationX, locationY } = evt.nativeEvent;
        const center = {
          x: layoutRef.current.width / 2,
          y: layoutRef.current.height / 2,
        };

        const currentAngle = calculateAngle(locationX, locationY, center);
        let rotation = currentAngle - startRotation.current;
        rotation = (rotation * 180) / Math.PI;

        // Enhanced smoothing with progressive factor
        const baseSmoothing = 0.8;
        const angleThreshold = 210; // Threshold for enhanced smoothing (35 minutes = 210 degrees)
        const currentAbsRotation = Math.abs(lastRotation.current);

        // Increase smoothing factor progressively after threshold
        const smoothingFactor =
          currentAbsRotation > angleThreshold
            ? baseSmoothing *
              (1 -
                ((currentAbsRotation - angleThreshold) /
                  (360 - angleThreshold)) *
                  0.3)
            : baseSmoothing;

        let newRotation = lastRotation.current + rotation * smoothingFactor;

        // Enhanced boundary handling with progressive constraints
        newRotation = Math.max(Math.min(newRotation, 0), -360);

        // Add movement deadzone near boundaries
        if (newRotation > -10) newRotation = Math.min(newRotation, -2);
        if (newRotation < -350) newRotation = Math.max(newRotation, -358);

        // Stabilize movement at higher angles
        if (currentAbsRotation > angleThreshold) {
          const snapPoints = [-210, -240, -270, -300, -330, -360];
          const snapThreshold = 5;

          for (const snapPoint of snapPoints) {
            if (Math.abs(newRotation - snapPoint) < snapThreshold) {
              newRotation = snapPoint;
              break;
            }
          }
        }

        // Update progress with enhanced precision
        const progress = Math.max(
          0,
          Math.min(1, 1 - Math.abs(newRotation) / 360)
        );
        animationValue.setValue(progress);

        // Update time with enhanced rounding for stability
        const newTimeLeft = Math.round((progress * maxTime) / 60) * 60;
        setTimeLeft(newTimeLeft);
      }, 16), // Throttle to ~60fps for smooth movement

      onPanResponderRelease: () => {
        if (isTiming) return;
        lastRotation.current = getCurrentRotation();
      },
    })
  ).current;

  // Measure layout on mount and orientation change
  useEffect(() => {
    const updateLayout = () => {
      viewRef.current?.measure((x, y, width, height, pageX, pageY) => {
        layoutRef.current = { x: pageX, y: pageY, width, height };
      });
    };

    updateLayout();
    const subscription = Dimensions.addEventListener('change', updateLayout);

    return () => {
      subscription.remove();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Rest of your component code remains the same...
  const getCurrentRotation = () => {
    const currentProgress = animationValue._value;
    return -(1 - currentProgress) * 360;
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleTimer = () => {
    if (isTiming) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      animationValue.stopAnimation(value => {
        progressRef.current = value;
      });
      setIsTiming(false);
    } else {
      if (isFirstStart.current) {
        setTimeLeft(workTime);
        animationValue.setValue(defaultProgress);
        isFirstStart.current = false;

        Animated.timing(animationValue, {
          toValue: 0,
          duration: workTime * 1000,
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
        Animated.timing(animationValue, {
          toValue: 0,
          duration: timeLeft * 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }).start();

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
          outputRange: ['0deg', '-360deg'],
        }),
      },
    ],
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={handleTimer}>
        <Text style={styles.buttonText}>
          {isFirstStart.current ? 'Start' : isTiming ? 'Pause' : 'Resume'}
        </Text>
      </TouchableOpacity>
      <View
        style={styles.container}
        ref={viewRef}
        onLayout={() => {
          viewRef.current?.measure((x, y, width, height, pageX, pageY) => {
            layoutRef.current = { x: pageX, y: pageY, width, height };
          });
        }}
      >
        <Animated.View
          style={[styles.box, combinedStyle]}
          {...panResponder.panHandlers}
        >
          <Animated.Image source={GreenClock} style={styles.clockImage} />
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
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    minWidth: 200,
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clockImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
