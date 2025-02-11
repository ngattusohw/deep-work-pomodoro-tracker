import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Easing,
  Text,
  TouchableOpacity,
} from 'react-native';
import PinkClock from '../../assets/pink_clock.png'; // Update this path

export default function RotatingTimer() {
  const [isTiming, setIsTiming] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current;
  const progressRef = useRef(0);
  const isFirstStart = useRef(true);
  const workTime = 25 * 60000;
  const breakTime = 5 * 6000;

  const handleTimer = () => {
    if (isTiming) {
      animationValue.stopAnimation(value => {
        progressRef.current = value;
      });
      setIsTiming(false);
    } else {
      if (isFirstStart.current) {
        animationValue.setValue(0);
        isFirstStart.current = false;
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
          easing: Easing.linear,
        }).start(({ finished }) => {
          if (finished) {
            isFirstStart.current = true;
          }
        });
      } else {
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
          <Animated.Image
            source={PinkClock}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
          />
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
