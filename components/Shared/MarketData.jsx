import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';

/**
 * Tabela de velas (klines) reutilizável.
 * Props: data, loading, error, intervals, currentInterval, onIntervalChange,
 *        limits, currentLimit, onLimitChange, itemsPerPage
 */
const MarketData = ({
  data,
  loading,
  error,
  intervals = [],
  currentInterval,
  onIntervalChange,
  limits = [],
  currentLimit,
  onLimitChange,
  itemsPerPage = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [data, currentLimit, currentInterval]);

  const getIntervalValue = (val) => (typeof val === 'object' ? val.value : val);
  const getIntervalLabel = (val) => (typeof val === 'object' ? val.label : val);

  if (loading && (!data || data.length === 0)) {
    return (
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Dados Históricos</Text>
        <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: spacing.md }} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Dados Históricos</Text>
        <Text style={styles.errorText}>Erro: {error}</Text>
      </View>
    );
  }

  const totalPages = data ? Math.ceil(data.length / itemsPerPage) : 0;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = data ? data.slice(startIdx, startIdx + itemsPerPage) : [];

  const currentLabel = intervals.find(i => getIntervalValue(i) === currentInterval)?.label || currentInterval;

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Dados Históricos ({currentLabel})</Text>

      {/* Seletor de intervalo */}
      <Text style={styles.filterLabel}>Intervalo:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {intervals.map((int, idx) => {
          const val = getIntervalValue(int);
          const label = getIntervalLabel(int);
          const active = val === currentInterval;
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.filterBtn, active && styles.filterBtnActive]}
              onPress={() => onIntervalChange(val)}
            >
              <Text style={[styles.filterBtnText, active && styles.filterBtnTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Seletor de limite */}
      <Text style={styles.filterLabel}>Limite:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {limits.map((lim) => {
          const active = lim === currentLimit;
          return (
            <TouchableOpacity
              key={lim}
              style={[styles.filterBtn, active && styles.filterBtnActive]}
              onPress={() => onLimitChange(lim)}
            >
              <Text style={[styles.filterBtnText, active && styles.filterBtnTextActive]}>
                {lim}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Cabeçalho da tabela */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={styles.tableHeader}>
            {['Abertura', 'Open', 'Max', 'Min', 'Close', 'Volume'].map((h) => (
              <Text key={h} style={styles.th}>{h}</Text>
            ))}
          </View>
          {currentItems.map((kline, index) => (
            <View key={index} style={[styles.tr, index % 2 === 0 && styles.trAlt]}>
              <Text style={styles.td}>
                {new Date(Number(kline[0])).toLocaleString('pt-BR', { timeStyle: 'short', dateStyle: 'short' })}
              </Text>
              <Text style={styles.td}>{parseFloat(kline[1]).toFixed(4)}</Text>
              <Text style={[styles.td, { color: colors.buyColor }]}>{parseFloat(kline[2]).toFixed(4)}</Text>
              <Text style={[styles.td, { color: colors.sellColor }]}>{parseFloat(kline[3]).toFixed(4)}</Text>
              <Text style={styles.td}>{parseFloat(kline[4]).toFixed(4)}</Text>
              <Text style={styles.td}>{parseFloat(kline[5]).toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
            onPress={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
          >
            <Text style={styles.pageBtnText}>← Ant</Text>
          </TouchableOpacity>
          <Text style={styles.pageInfo}>{currentPage}/{totalPages}</Text>
          <TouchableOpacity
            style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
            onPress={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages}
          >
            <Text style={styles.pageBtnText}>Próx →</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MarketData;

const COL_WIDTH = 90;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  sectionTitle: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: fontSize.lg,
    marginBottom: spacing.md,
  },
  filterLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  filterBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.borderColor,
    marginRight: spacing.xs,
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterBtnText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  filterBtnTextActive: {
    color: colors.backgroundDark,
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    paddingVertical: spacing.xs,
  },
  th: {
    width: COL_WIDTH,
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: fontSize.xs,
    paddingHorizontal: spacing.xs,
  },
  tr: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  trAlt: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  td: {
    width: COL_WIDTH,
    color: colors.textPrimary,
    fontSize: fontSize.xs,
    paddingHorizontal: spacing.xs,
  },
  errorText: {
    color: colors.errorColor,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  pageBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },
  pageBtnDisabled: {
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  pageBtnText: {
    color: colors.backgroundDark,
    fontWeight: 'bold',
    fontSize: fontSize.sm,
  },
  pageInfo: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
});
