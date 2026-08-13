import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { CATEGORIES, COLORS, RADIUS, SPACING } from '@/constants/theme';
import { Category } from '@/types/habit';
import { AppIcon } from './AppIcon';

interface CategoryFilterProps {
  selected: Category;
  onSelect: (cat: Category) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selected, onSelect }) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selected === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.7}
              onPress={() => onSelect(cat.id)}
              style={[
                styles.chip,
                isActive ? { backgroundColor: cat.color } : styles.inactiveChip,
              ]}
            >
              <AppIcon
                name={cat.iconName}
                size={16}
                color={isActive ? '#FFFFFF' : COLORS.textMuted}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.label,
                  isActive ? styles.activeLabel : styles.inactiveLabel,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
  },
  container: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inactiveChip: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.cardBorder,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeLabel: {
    color: '#FFFFFF',
  },
  inactiveLabel: {
    color: COLORS.textMuted,
  },
});
