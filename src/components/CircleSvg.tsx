import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

const CircleWithLine = ({
  size = 600,
  circleColor = 'black',
  lineColor = 'white',
  lineWidth = 2,
}) => {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="50" fill={circleColor} />
        <Line
          x1="0"
          y1="50"
          x2="100"
          y2="50"
          stroke={lineColor}
          strokeWidth={lineWidth}
        />
      </Svg>
    </View>
  );
};

export default CircleWithLine;
