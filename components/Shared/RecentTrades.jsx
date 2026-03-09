import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';

/**
 * Trades recentes reutilizável.
 * Props: data, loading, error
 * data: Array de { price, amount, time, side: 'buy'|'sell' }
 */
const RecentTrades = ({ data, loading, error }) => {
  const renderItem = ({ item, index }) => {
    const isBuy = item.side === 'buy';
    return (
      <View style={[styles.row, index % 2 === 0 && styles.rowAlt]}>
        <Text style={[styles.cell, styles.flex1, isBuy ? styles.buyPrice : styles.sellPrice]}>
          {parseFloat(item.price).toFixed(6)}
        </Text>
        <Text style={[styles.cell, styles.flex1]}>{parseFloat(item.amount).toFixed(6)}</Text>
        <Text style={[styles.cell, styles.flex1, styles.time]}>
          {new Date(item.time).toLocaleTimeString('pt-BR')}
        </Text>
        <Text style={[styles.cell, styles.flex1, isBuy ? styles.buyPrice : styles.sellPrice]}>
          {isBuy ? 'Compra' : 'Venda'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Últimas Transações</Text>

      {loading && (!data || data.length === 0) ? (
        <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: spacing.md }} />
      ) : error ? (
        <Text style={styles.errorText}>Erro: {error}</Text>
      ) : (
        <>
          <View style={styles.tableHeader}>
            {['Preço', 'Quantidade', 'Horário', 'Lado'].map((h) => (
              <Text key={h} style={[styles.th, styles.flex1]}>{h}</Text>
            ))}
          </View>
          <FlatList
            data={data}
            keyExtractor={(_, index) => String(index)}
            renderItem={renderItem}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhuma negociação recente</Text>
            }
          />
        </>
      )}
    </View>
  );
};

export default RecentTrades;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
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
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.xs,
  },
  th: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  rowAlt: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  cell: {
    color: colors.textPrimary,
    fontSize: fontSize.xs,
  },
  flex1: {
    flex: 1,
  },
  buyPrice: {
    color: colors.buyColor,
    fontWeight: '600',
  },
  sellPrice: {
    color: colors.sellColor,
    fontWeight: '600',
  },
  time: {
    color: colors.textSecondary,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.md,
    fontSize: fontSize.sm,
  },
  errorText: {
    color: colors.errorColor,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
  },
});
