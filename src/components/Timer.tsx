import React from 'react';
import { Text } from 'react-native';
import {
  CountdownCircleTimer,
  useCountdown,
} from 'react-native-countdown-circle-timer';

export default function Timer({
  handleTimerComplete,
  timeLeft,
  isPlaying,
  restartKey,
}) {
  const {
    path,
    pathLength,
    stroke,
    strokeDashoffset,
    remainingTime,
    elapsedTime,
    size,
    strokeWidth,
  } = useCountdown({ isPlaying: true, duration: 7, colors: '#abc' });

  return (
    <CountdownCircleTimer
      size={310}
      isPlaying={isPlaying}
      duration={timeLeft}
      key={restartKey}
      colors={['#004777', '#F7B801', '#A30000', '#A30000']}
      colorsTime={[1200, 900, 500, 50]}
      onComplete={() => {
        handleTimerComplete();
      }}
    >
      {({ remainingTime, color }) => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = String(remainingTime % 60).padStart(2, '0');

        return (
          <Text
            accessibilityRole="timer"
            accessibilityLiveRegion="assertive"
            importantForAccessibility="yes"
            style={{ color, fontSize: 40 }}
          >{`${minutes}:${seconds}`}</Text>
        );
      }}
    </CountdownCircleTimer>
  );
}
