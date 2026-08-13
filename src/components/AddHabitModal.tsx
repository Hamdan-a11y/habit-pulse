import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, COLORS, RADIUS, SPACING } from '@/constants/theme';
import { Category } from '@/types/habit';

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (habit: {
    title: string;
    description: string;
    category: Exclude<Category, 'all'>;
    color: string;
    icon: string;
    targetPerWeek: number;
  }) => void;
}

const AVAILABLE_ICONS = ['star', 'fitness', 'code-slash', 'leaf', 'heart', 'book', 'flash', 'water', 'barbell', 'bicycle'];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Exclude<Category, 'all'>>('health');
  const [selectedIcon, setSelectedIcon] = useState('star');

  const availableCategories = CATEGORIES.filter((c) => c.id !== 'all') as Array<{
    id: Exclude<Category, 'all'>;
    label: string;
    iconName: string;
    color: string;
  }>;

  const handleSubmit = () => {
    if (!title.trim()) return;
    const catConfig = CATEGORIES.find((c) => c.id === selectedCategory);
    onAdd({
      title: title.trim(),
      description: description.trim(),
      category: selectedCategory,
      color: catConfig ? catConfig.color : COLORS.primary,
      icon: selectedIcon,
      targetPerWeek: 7,
    });
    // Reset form
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create New Habit</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            {/* Title Input */}
            <Text style={styles.label}>Habit Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Read 15 pages"
              placeholderTextColor={COLORS.textSubtle}
              value={title}
              onChangeText={setTitle}
            />

            {/* Description Input */}
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g., Daily book chapter before sleep"
              placeholderTextColor={COLORS.textSubtle}
              multiline
              numberOfLines={2}
              value={description}
              onChangeText={setDescription}
            />

            {/* Category Selector */}
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryGrid}>
              {availableCategories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                    style={[
                      styles.categoryOption,
                      isSelected
                        ? { backgroundColor: cat.color, borderColor: cat.color }
                        : styles.inactiveCategory,
                    ]}
                  >
                    <Ionicons
                      name={cat.iconName as any}
                      size={16}
                      color={isSelected ? '#FFFFFF' : COLORS.textMuted}
                    />
                    <Text
                      style={[
                        styles.categoryOptionText,
                        { color: isSelected ? '#FFFFFF' : COLORS.textMuted },
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Icon Picker */}
            <Text style={styles.label}>Icon</Text>
            <View style={styles.iconGrid}>
              {AVAILABLE_ICONS.map((icon) => {
                const isSelected = selectedIcon === icon;
                return (
                  <TouchableOpacity
                    key={icon}
                    onPress={() => setSelectedIcon(icon)}
                    style={[
                      styles.iconOption,
                      isSelected && {
                        backgroundColor: COLORS.primaryLight,
                        borderColor: COLORS.primary,
                      },
                    ]}
                  >
                    <Ionicons
                      name={icon as any}
                      size={20}
                      color={isSelected ? COLORS.primary : COLORS.textMuted}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, !title.trim() && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!title.trim()}
          >
            <Text style={styles.submitText}>Save Habit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    padding: SPACING.lg,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  formContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.cardBorder,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    color: COLORS.text,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    fontSize: 15,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: 6,
  },
  inactiveCategory: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.cardBorder,
  },
  categoryOptionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    borderColor: COLORS.cardBorder,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
