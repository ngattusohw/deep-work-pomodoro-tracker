import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '../src/context/AuthContext';

export default function HomeScreen() {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Deep Work Tracker</Text>
      <Button title="Sign Out" onPress={() => signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});
