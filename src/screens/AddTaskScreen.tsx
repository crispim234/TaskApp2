import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, Alert, Button,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../context/TaskContext';
import type { ThemeColors } from '../theme/colors';
import type { AddTaskScreenProps, Priority } from '../types';

const CATEGORIES = ['Estudos', 'Faculdade', 'Saúde', 'Trabalho', 'Pessoal'] as const;
const PRIORITIES: Priority[] = ['Alta', 'Média', 'Baixa'];
const PRIORITY_COLORS: Record<Priority, string> = { Alta: '#FF4757', Média: '#FFB547', Baixa: '#22C55E' };
const PRIORITY_BG: Record<Priority, string> = {
  Alta: 'rgba(255,71,87,0.15)',
  Média: 'rgba(255,181,71,0.15)',
  Baixa: 'rgba(34,197,94,0.15)',
};

export default function AddTaskScreen({ navigation }: AddTaskScreenProps) {
  const { addTask, colors } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('Estudos');
  const [priority, setPriority] = useState<Priority>('Média');
  const [saving, setSaving] = useState(false);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('Campo obrigatório', 'O título da tarefa não pode ficar em branco.');
      return;
    }
    setSaving(true);
    const ok = await addTask({ title: title.trim(), description: description.trim(), category, priority });
    setSaving(false);
    if (ok) navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.flex}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Tarefa</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.field}>
          <Text style={styles.label}>Título <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Estudar para a prova de cálculo"
            placeholderTextColor={colors.placeholder}
            value={title}
            onChangeText={setTitle}
            maxLength={80}
          />
          <Text style={styles.counter}>{title.length}/80</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Detalhes opcionais sobre a tarefa..."
            placeholderTextColor={colors.placeholder}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={300}
            textAlignVertical="top"
          />
          <Text style={styles.counter}>{description.length}/300</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Categoria</Text>
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
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Prioridade</Text>
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
        </View>

        <View style={styles.divider} />

        <View style={styles.field}>
          <Text style={styles.label}>Pré-visualização</Text>
          <View style={styles.previewCard}>
            <View style={[styles.previewAccent, { backgroundColor: PRIORITY_COLORS[priority] }]} />
            <View style={styles.previewBody}>
              <Text style={styles.previewTitle}>{title || 'Título da tarefa'}</Text>
              {description ? <Text style={styles.previewDesc} numberOfLines={2}>{description}</Text> : null}
              <View style={styles.previewRow}>
                <View style={styles.previewCategory}>
                  <Text style={styles.previewCategoryText}>{category}</Text>
                </View>
                <View style={[styles.previewPriority, { backgroundColor: PRIORITY_BG[priority] }]}>
                  <Text style={[styles.previewPriorityText, { color: PRIORITY_COLORS[priority] }]}>{priority}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <View style={styles.cancelButton}>
            <Button title="Cancelar" onPress={() => navigation.goBack()} color={colors.textSecondary} />
          </View>
          <TouchableOpacity
            style={[styles.saveButton, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveText}>{saving ? 'Salvando...' : 'Salvar Tarefa'}</Text>
          </TouchableOpacity>
        </View>
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
    container: { padding: 20, paddingBottom: 40 },
    field: { marginBottom: 22 },
    label: { fontSize: 12, fontWeight: '700', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
    required: { color: '#FF4757' },
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
    counter: { fontSize: 11, color: c.textMuted, textAlign: 'right', marginTop: 6 },
    optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    optionChip: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 12,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
    },
    optionChipActive: { backgroundColor: c.accentBg, borderColor: c.accent },
    optionText: { fontSize: 13, color: c.textSecondary, fontWeight: '600' },
    optionTextActive: { color: c.accent },
    priorityRow: { flexDirection: 'row', gap: 10 },
    priorityChip: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
    },
    priorityDot: { width: 8, height: 8, borderRadius: 4 },
    priorityText: { fontSize: 13, color: c.textSecondary, fontWeight: '600' },
    divider: { height: 1, backgroundColor: c.border, marginBottom: 22 },
    previewCard: {
      backgroundColor: c.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      flexDirection: 'row',
      overflow: 'hidden',
    },
    previewAccent: { width: 4 },
    previewBody: { flex: 1, padding: 14 },
    previewTitle: { fontSize: 15, fontWeight: '600', color: c.textPrimary, marginBottom: 4 },
    previewDesc: { fontSize: 13, color: c.textSecondary, marginBottom: 8 },
    previewRow: { flexDirection: 'row', gap: 8 },
    previewCategory: { backgroundColor: c.accentBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    previewCategoryText: { fontSize: 11, color: c.accent, fontWeight: '600' },
    previewPriority: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    previewPriorityText: { fontSize: 11, fontWeight: '700' },
    buttonRow: { flexDirection: 'row', gap: 12 },
    cancelButton: {
      flex: 1,
      paddingVertical: 15,
      borderRadius: 14,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveButton: { flex: 2, paddingVertical: 15, borderRadius: 14, backgroundColor: c.accent, alignItems: 'center' },
    saveText: { fontSize: 15, color: '#FFF', fontWeight: '700' },
  });
}
