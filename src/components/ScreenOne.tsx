import { Alert, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/core';
import * as React from 'react';
import { FrameNavigationProp } from 'react-nativescript-navigation';

import { MainStackParamList } from '../NavigationParamList';

type ScreenOneProps = {
  route: RouteProp<MainStackParamList, 'One'>;
  navigation: FrameNavigationProp<MainStackParamList, 'One'>;
};

export function ScreenOne({ navigation }: ScreenOneProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Hello World!</Text>
      <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Tapped!')}>
        <Text style={styles.buttonText}>Tap me for an alert</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ScreenTwo', { message: 'Hello, world!' })}
      >
        <Text style={styles.buttonText}>Go to next screen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  label: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: '#2e6ddf',
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});
