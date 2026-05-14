import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../context/TaskContext';
import type { ThemeColors } from '../theme/colors';
import type { TaskDetailScreenProps, Priority } from '../types';

const CATEGORIES = ['Estudos', 'Faculdade', 'Saúde', 'Trabalho', 'Pessoal'] as const;
const PRIORITIES: Priority[] = ['Alta', 'Média', 'Baixa'];
const PRIORITY_COLORS: Record<Priority, string> = { Alta: '#FF4757', Média: '#FFB547', Baixa: '#22C55E' };
const PRIORITY_BG: Record<Priority, string> = {
  Alta: 'rgba(255,71,87,0.15)',
  Média: 'rgba(255,181,71,0.15)',
  Baixa: 'rgba(34,197,94,0.15)',
};

export default function TaskDetailScreen({ navigation, route }: TaskDetailScreenProps) {
  const { taskId } = route.params;
  const { tasks, updateTask, deleteTask, toggleStatus, colors } = useTasks();
  const task = tasks.find(t => t.id === taskId);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('Média');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? '');
      setCategory(task.category);
      setPriority(task.priority);
    }
  }, [task]);

  if (!task) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Tarefa não encontrada.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function handleSave() {
    if (!title.trim()) {
      Alert.alert('Campo obrigatório', 'O título não pode ficar em branco.');
      return;
    }
    updateTask({ ...task!, title: title.trim(), description: description.trim(), category, priority });
    setIsEditing(false);
  }

  function handleDelete() {
    Alert.alert('Excluir tarefa', 'Tem certeza? Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => { deleteTask(task!.id); navigation.goBack(); } },
    ]);
  }

  function handleCancel() {
    setTitle(task!.title);
    setDescription(task!.description ?? '');
    setCategory(task!.category);
    setPriority(task!.priority);
    setIsEditing(false);
  }

  const isCompleted = task.status === 'concluído';

  return (
    <SafeAreaView style={styles.flex}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {isEditing ? 'Editando' : 'Detalhes'}
        </Text>
        <TouchableOpacity
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          style={styles.editBtn}
        >
          <Text style={styles.editText}>{isEditing ? 'Salvar' : 'Editar'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          style={[styles.statusBanner, isCompleted ? styles.statusDone : styles.statusPending]}
          onPress={() => toggleStatus(task.id)}
          activeOpacity={0.8}
        >
          <View style={[styles.statusDot, { backgroundColor: isCompleted ? colors.success : colors.accent }]} />
          <View style={styles.statusContent}>
            <Text style={styles.statusLabel}>Status atual</Text>
            <Text style={[styles.statusValue, { color: isCompleted ? colors.success : colors.accent }]}>
              {isCompleted ? '✓ Concluída' : '○ Pendente'}
            </Text>
          </View>
          <Text style={styles.statusTap}>Toque para alternar →</Text>
        </TouchableOpacity>

        <View style={styles.field}>
          <Text style={styles.label}>Título</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              maxLength={80}
              placeholder="Título da tarefa"
              placeholderTextColor={colors.placeholder}
            />
          ) : (
            <Text style={styles.value}>{task.title}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descrição</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={300}
              placeholder="Descrição opcional..."
              placeholderTextColor={colors.placeholder}
              textAlignVertical="top"
            />
          ) : (
            <Text style={[styles.value, !task.description && styles.valueMuted]}>
              {task.description || 'Sem descrição'}
            </Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Categoria</Text>
          {isEditing ? (
            <View style={styles.optionsRow}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.optionChip, category === cat && styles.optionChipActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.optionText, category === cat && styles.optionTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{task.category}</Text>
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Prioridade</Text>
          {isEditing ? (
            <View style={styles.priorityRow}>
              {PRIORITIES.map(p => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityChip,
                    priority === p && { backgroundColor: PRIORITY_BG[p], borderColor: PRIORITY_COLORS[p] },
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLORS[p] }]} />
                  <Text style={[styles.priorityText, priority === p && { color: PRIORITY_COLORS[p] }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_BG[task.priority] }]}>
              <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLORS[task.priority] }]} />
              <Text style={[styles.priorityBadgeText, { color: PRIORITY_COLORS[task.priority] }]}>{task.priority}</Text>
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Criada em</Text>
          <Text style={styles.value}>
            {new Date(task.createdAt ?? task.created_at ?? '').toLocaleDateString('pt-BR', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.divider} />

        {isEditing ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteText}>Excluir Tarefa</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: c.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: c.border },
    backText: { fontSize: 18, color: c.textPrimary, fontWeight: 'bold' },
    headerTitle: { fontSize: 17, fontWeight: '700', color: c.textPrimary },
    editBtn: { backgroundColor: c.accentBg, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: c.accentBorder },
    editText: { color: c.accent, fontWeight: '700', fontSize: 14 },
    container: { padding: 20, paddingBottom: 40 },
    statusBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
      borderWidth: 1,
    },
    statusDone: { backgroundColor: c.successBg, borderColor: 'rgba(34,197,94,0.25)' },
    statusPending: { backgroundColor: c.accentBg, borderColor: c.accentBorder },
    statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 14 },
    statusContent: { flex: 1 },
    statusLabel: { fontSize: 11, color: c.textSecondary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
    statusValue: { fontSize: 16, fontWeight: '700', marginTop: 2 },
    statusTap: { fontSize: 11, color: c.textMuted },
    field: { marginBottom: 22 },
    label: { fontSize: 11, fontWeight: '700', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
    value: { fontSize: 16, color: c.textPrimary, lineHeight: 24 },
    valueMuted: { color: c.textMuted, fontStyle: 'italic' },
    input: {
      backgroundColor: c.input,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 15,
      color: c.textPrimary,
    },
    textArea: { minHeight: 100 },
    badge: { backgroundColor: c.accentBg, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
    badgeText: { color: c.accent, fontWeight: '700', fontSize: 13 },
    priorityBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
    priorityBadgeText: { fontWeight: '700', fontSize: 13 },
    priorityDot: { width: 8, height: 8, borderRadius: 4 },
    optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    optionChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, backgroundColor: c.card, borderWidth: 1, borderColor: c.border },
    optionChipActive: { backgroundColor: c.accentBg, borderColor: c.accent },
    optionText: { fontSize: 13, color: c.textSecondary, fontWeight: '600' },
    optionTextActive: { color: c.accent },
    priorityRow: { flexDirection: 'row', gap: 10 },
    priorityChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12, backgroundColor: c.card, borderWidth: 1, borderColor: c.border },
    priorityText: { fontSize: 13, color: c.textSecondary, fontWeight: '600' },
    divider: { height: 1, backgroundColor: c.border, marginBottom: 22 },
    buttonRow: { flexDirection: 'row', gap: 12 },
    cancelButton: { flex: 1, paddingVertical: 15, borderRadius: 14, backgroundColor: c.card, borderWidth: 1, borderColor: c.border, alignItems: 'center' },
    cancelText: { fontSize: 15, color: c.textSecondary, fontWeight: '600' },
    saveButton: { flex: 2, paddingVertical: 15, borderRadius: 14, backgroundColor: c.accent, alignItems: 'center' },
    saveText: { fontSize: 15, color: '#FFF', fontWeight: '700' },
    deleteButton: {
      paddingVertical: 15,
      borderRadius: 14,
      backgroundColor: c.dangerBg,
      borderWidth: 1,
      borderColor: c.dangerBorder,
      alignItems: 'center',
    },
    deleteText: { fontSize: 15, color: c.danger, fontWeight: '600' },
    notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: c.bg },
    notFoundText: { fontSize: 16, color: c.textSecondary, marginBottom: 12 },
    backLink: { color: c.accent, fontSize: 16, fontWeight: '600' },
  });
}
