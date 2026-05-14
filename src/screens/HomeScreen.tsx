import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  StyleSheet, Image,
} from 'react-native';
import { useTasks } from '../context/TaskContext';
import TaskItem from '../components/TaskItem';
import type { ThemeColors } from '../theme/colors';
import type { HomeScreenProps } from '../types';

const FILTERS = ['Todas', 'Pendentes', 'Concluídas'] as const;
const CATEGORIES = ['Todas', 'Estudos', 'Faculdade', 'Saúde', 'Trabalho', 'Pessoal'] as const;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { tasks, toggleStatus, user, colors } = useTasks();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todas');
  const [category, setCategory] = useState('Todas');
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === 'Todas' ||
        (filter === 'Pendentes' && t.status === 'pendente') ||
        (filter === 'Concluídas' && t.status === 'concluído');
      const matchCategory = category === 'Todas' || t.category === category;
      return matchSearch && matchFilter && matchCategory;
    });
  }, [tasks, search, filter, category]);

  const pending = tasks.filter(t => t.status === 'pendente').length;
  const done = tasks.filter(t => t.status === 'concluído').length;

  function renderEmpty() {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>✓</Text>
        </View>
        <Text style={styles.emptyTitle}>Nenhuma tarefa encontrada</Text>
        <Text style={styles.emptySubtitle}>Toque no + para adicionar uma nova tarefa</Text>
      </View>
    );
  }

  const firstName = user?.user_metadata?.name?.split(' ')[0] ?? 'Usuário';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {firstName} 👋</Text>
          <Text style={styles.headerSub}>
            {pending === 0
              ? 'Tudo em dia! Sem pendências.'
              : `Você tem ${pending} tarefa${pending !== 1 ? 's' : ''} pendente${pending !== 1 ? 's' : ''}`}
          </Text>
        </View>
        <Image source={require('../../assets/avatar.png')} style={styles.avatar} />
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{tasks.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={[styles.summaryCard, styles.summaryCardAccent]}>
          <Text style={[styles.summaryNumber, { color: colors.accent }]}>{pending}</Text>
          <Text style={styles.summaryLabel}>Pendentes</Text>
        </View>
        <View style={[styles.summaryCard, styles.summaryCardGreen]}>
          <Text style={[styles.summaryNumber, { color: colors.success }]}>{done}</Text>
          <Text style={styles.summaryLabel}>Concluídas</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar tarefas..."
          placeholderTextColor={colors.placeholder}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filtersRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={CATEGORIES}
        keyExtractor={item => item}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryChip, category === item && styles.categoryChipActive]}
            onPress={() => setCategory(item)}
          >
            <Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
            onToggle={() => toggleStatus(item.id)}
          />
        )}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={filtered.length === 0 ? styles.emptyList : { paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddTask')} activeOpacity={0.85}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
    },
    greeting: { fontSize: 22, fontWeight: '800', color: c.textPrimary },
    headerSub: { fontSize: 13, color: c.textSecondary, marginTop: 3 },
    avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: c.border },
    summaryRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, gap: 10 },
    summaryCard: {
      flex: 1,
      borderRadius: 16,
      padding: 14,
      alignItems: 'center',
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
    },
    summaryCardAccent: { borderColor: c.accentBorder },
    summaryCardGreen: { borderColor: 'rgba(34,197,94,0.3)' },
    summaryNumber: { fontSize: 26, fontWeight: '800', color: c.textPrimary },
    summaryLabel: { fontSize: 11, color: c.textSecondary, marginTop: 2, fontWeight: '600' },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: 14,
      marginHorizontal: 16,
      marginBottom: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: c.border,
    },
    searchIcon: { fontSize: 15, marginRight: 10 },
    searchInput: { flex: 1, fontSize: 14, color: c.textPrimary },
    clearSearch: { fontSize: 14, color: c.textMuted, padding: 4 },
    filtersRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8, gap: 8 },
    filterChip: {
      paddingHorizontal: 16,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
    },
    filterChipActive: { backgroundColor: c.accent, borderColor: c.accent },
    filterText: { fontSize: 13, color: c.textSecondary, fontWeight: '600' },
    filterTextActive: { color: '#FFF' },
    categoryList: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
    categoryChip: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
    },
    categoryChipActive: { backgroundColor: c.accentBg, borderColor: c.accent },
    categoryText: { fontSize: 12, color: c.textSecondary, fontWeight: '600' },
    categoryTextActive: { color: c.accent },
    emptyList: { flex: 1 },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
    emptyIcon: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: c.accentBg,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
      borderWidth: 1,
      borderColor: c.accentBorder,
    },
    emptyIconText: { fontSize: 30, color: c.accent },
    emptyTitle: { fontSize: 17, fontWeight: '700', color: c.textPrimary, marginBottom: 8 },
    emptySubtitle: { fontSize: 13, color: c.textSecondary, textAlign: 'center' },
    fab: {
      position: 'absolute',
      bottom: 28,
      right: 24,
      backgroundColor: c.accent,
      width: 58,
      height: 58,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.45,
      shadowRadius: 12,
      elevation: 8,
    },
    fabIcon: { fontSize: 28, color: '#FFF', fontWeight: '300', lineHeight: 32 },
  });
}
