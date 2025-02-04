import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Easing } from 'react-native';
import CircleWithLine from './CircleSvg';

export default function RotatingTimer() {
  const rotateValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    // Rotate animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(rotateValue, {
          toValue: 2,
          duration: 8000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ])
    ).start();
  }, [rotateValue]);

  const combinedStyle = {
    transform: [
      {
        rotate: rotateValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, combinedStyle]}>
        <CircleWithLine />
      </Animated.View>
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
