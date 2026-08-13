import React from 'react';
import { Platform, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AppIconProps {
  name: string;
  size?: number;
  color?: string | any;
  style?: any;
}

// Icon emoji & symbol fallbacks for web browsers
const EMOJI_MAP: Record<string, string> = {
  'apps': '📱',
  'heart': '❤️',
  'fitness': '🏋️',
  'code-slash': '💻',
  'code': '💻',
  'leaf': '🧘',
  'flash': '⚡',
  'flame': '🔥',
  'flame-outline': '🔥',
  'star': '⭐',
  'book': '📚',
  'water': '💧',
  'barbell': '🏋️',
  'bicycle': '🚴',
  'add': '➕',
  'close': '✖️',
  'trash-outline': '🗑️',
  'checkmark': '✔️',
  'search-outline': '🔍',
  'close-circle': '✖️',
  'trophy': '🏆',
  'list': '📊',
  'checkbox-outline': '📅',
  'analytics-outline': '📈',
  'sparkles-outline': '✨',
  'add-circle-outline': '➕',
};

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 20,
  color = '#FFFFFF',
  style,
}) => {
  if (Platform.OS === 'web') {
    const symbol = EMOJI_MAP[name] || '✨';
    return (
      <Text
        style={[
          styles.webIcon,
          { fontSize: size * 0.85, color },
          style,
        ]}
      >
        {symbol}
      </Text>
    );
  }

  return <Ionicons name={name as any} size={size} color={color} style={style} />;
};

const styles = StyleSheet.create({
  webIcon: {
    textAlign: 'center',
    includeFontPadding: false,
  },
});
