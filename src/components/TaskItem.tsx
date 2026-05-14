import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTasks } from '../context/TaskContext';
import type { ThemeColors } from '../theme/colors';
import type { Task } from '../types';

interface Props {
  task: Task;
  onPress: () => void;
  onToggle: () => void;
}

const PRIORITY_COLORS: Record<string, string> = { Alta: '#FF4757', Média: '#FFB547', Baixa: '#22C55E' };
const PRIORITY_BG: Record<string, string> = {
  Alta: 'rgba(255,71,87,0.12)',
  Média: 'rgba(255,181,71,0.12)',
  Baixa: 'rgba(34,197,94,0.12)',
};

export default function TaskItem({ task, onPress, onToggle }: Props) {
  const { colors } = useTasks();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const priorityColor = PRIORITY_COLORS[task.priority] ?? '#8B8FA8';
  const priorityBg = PRIORITY_BG[task.priority] ?? 'rgba(139,143,168,0.12)';
  const isCompleted = task.status === 'concluído';

  return (
    <TouchableOpacity
      style={[styles.container, isCompleted && styles.completedContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        style={[styles.checkbox, isCompleted && styles.checkboxDone]}
        onPress={onToggle}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.title, isCompleted && styles.titleDone]} numberOfLines={1}>
            {task.title}
          </Text>
          <View style={[styles.priorityBadge, { backgroundColor: priorityBg }]}>
            <Text style={[styles.priorityText, { color: priorityColor }]}>{task.priority}</Text>
          </View>
        </View>

        {task.description ? (
          <Text style={styles.description} numberOfLines={1}>{task.description}</Text>
        ) : null}

        <View style={styles.bottomRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{task.category}</Text>
          </View>
          <Text style={styles.date}>
            {new Date(task.createdAt ?? task.created_at ?? '').toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 5,
      borderWidth: 1,
      borderColor: c.border,
    },
    completedContainer: { opacity: 0.5 },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 7,
      borderWidth: 2,
      borderColor: c.border,
      marginRight: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxDone: { backgroundColor: c.success, borderColor: c.success },
    checkmark: { fontSize: 13, color: '#FFF', fontWeight: '700' },
    content: { flex: 1 },
    topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
    title: { flex: 1, fontSize: 15, fontWeight: '600', color: c.textPrimary, marginRight: 8 },
    titleDone: { textDecorationLine: 'line-through', color: c.textMuted },
    priorityBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    priorityText: { fontSize: 11, fontWeight: '700' },
    description: { fontSize: 13, color: c.textSecondary, marginBottom: 8 },
    bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    categoryBadge: { backgroundColor: c.accentBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    categoryText: { fontSize: 11, color: c.accent, fontWeight: '600' },
    date: { fontSize: 11, color: c.textMuted },
  });
}
