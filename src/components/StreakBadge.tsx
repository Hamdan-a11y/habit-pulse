import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS } from '@/constants/theme';
import { AppIcon } from './AppIcon';

interface StreakBadgeProps {
  streak: number;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ streak }) => {
  if (streak === 0) {
    return (
      <View style={[styles.badge, styles.inactiveBadge]}>
        <AppIcon name="flame-outline" size={14} color={COLORS.textSubtle} />
        <Text style={styles.inactiveText}>0</Text>
      </View>
    );
  }

  return (
    <View style={[styles.badge, styles.activeBadge]}>
      <AppIcon name="flame" size={15} color={COLORS.warning} />
      <Text style={styles.activeText}>{streak}d</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  activeBadge: {
    backgroundColor: COLORS.warningLight,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  inactiveBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  activeText: {
    color: COLORS.warning,
    fontSize: 12,
    fontWeight: '700',
  },
  inactiveText: {
    color: COLORS.textSubtle,
    fontSize: 12,
    fontWeight: '500',
  },
});
