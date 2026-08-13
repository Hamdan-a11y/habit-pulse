import React, { useEffect } from 'react';
import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { HabitProvider } from '@/context/HabitContext';
import { COLORS } from '@/constants/theme';
import iconFont from '@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf';

export default function RootLayout() {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const styleId = 'expo-vector-icons-ionicons';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.type = 'text/css';
        style.appendChild(
          document.createTextNode(`
            @font-face {
              font-family: 'Ionicons';
              src: url('${iconFont}') format('truetype');
            }
          `)
        );
        document.head.appendChild(style);
      }
    }
  }, []);

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
