import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Easing,
  Text,
  TouchableOpacity,
} from 'react-native';
import CircleWithLine from './CircleSvg';

export default function RotatingTimer() {
  const [isTiming, setIsTiming] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current;
  const progressRef = useRef(0);
  const isFirstStart = useRef(true);

  const handleTimer = () => {
    if (isTiming) {
      // Pause
      animationValue.stopAnimation(value => {
        progressRef.current = value;
      });
      setIsTiming(false);
    } else {
      if (isFirstStart.current) {
        // Initial start
        animationValue.setValue(0);
        isFirstStart.current = false;
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
          easing: Easing.linear,
        }).start();
      } else {
        // Resume
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 8000 * (1 - progressRef.current),
          useNativeDriver: true,
          easing: Easing.linear,
        }).start();
      }
      setIsTiming(true);
    }
  };

  const combinedStyle = {
    transform: [
      {
        rotate: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
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
          <CircleWithLine />
        </Animated.View>
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
});
