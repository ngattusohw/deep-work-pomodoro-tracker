import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function MainLayout() {
  const { session } = useAuth();

  if (!session) {
    return (
      <Tabs>
        <Tabs.Screen
          name="login"
          options={{
            headerShown: false,
            href: '/login',
          }}
        />
      </Tabs>
    );
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
