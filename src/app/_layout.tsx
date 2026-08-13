import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { HabitProvider } from '@/context/HabitContext';
import { COLORS } from '@/constants/theme';

export default function RootLayout() {
  return (
    <HabitProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </HabitProvider>
  );
}
