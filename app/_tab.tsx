import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';

export default function TabLayout() {
  const { session } = useAuth();

  if (!session) {
    // If not authenticated, do not show tabs
    return null;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: 'Timer',
          tabBarIcon: ({ color, size }) => <Ionicons name="timer" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
