import { View, Text, ScrollView, ActivityIndicator, StyleSheet, useWindowDimensions } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';

/**
 * Order Book reutilizável.
 * Props: bids, asks, loading, error
 * bids/asks: Array de [price, amount]
 */
const OrderBook = ({ bids, asks, loading, error }) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 600;

  const renderRows = (entries, isBid) =>
    entries && entries.length > 0 ? (
      entries.map((entry, index) => {
        const price = parseFloat(entry[0]);
        const amount = parseFloat(entry[1]);
        return (
          <View key={index} style={[styles.row, index % 2 === 0 && styles.rowAlt]}>
            <Text style={[styles.cell, isBid ? styles.bidPrice : styles.askPrice, styles.flex1]}>
              {price.toFixed(6)}
            </Text>
            <Text style={[styles.cell, styles.flex1]}>{amount.toFixed(6)}</Text>
            <Text style={[styles.cell, styles.flex1]}>{(price * amount).toFixed(4)}</Text>
          </View>
        );
      })
    ) : (
      <Text style={styles.emptyText}>Sem ofertas</Text>
    );

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Livro de Ofertas (Order Book)</Text>

      {loading && (!bids || bids.length === 0) ? (
        <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: spacing.md }} />
      ) : error ? (
        <Text style={styles.errorText}>Erro: {error}</Text>
      ) : (
        <View style={[styles.columns, isWide && styles.columnsRow]}>
          {/* Bids */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Compras (Bids)</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, styles.flex1]}>Preço</Text>
              <Text style={[styles.th, styles.flex1]}>Qtd</Text>
              <Text style={[styles.th, styles.flex1]}>Total</Text>
            </View>
            <ScrollView>{renderRows(bids, true)}</ScrollView>
          </View>

          {/* Divider */}
          <View style={isWide ? styles.dividerVertical : styles.dividerHorizontal} />

          {/* Asks */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Vendas (Asks)</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, styles.flex1]}>Preço</Text>
              <Text style={[styles.th, styles.flex1]}>Qtd</Text>
              <Text style={[styles.th, styles.flex1]}>Total</Text>
            </View>
            <ScrollView>{renderRows(asks, false)}</ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

export default OrderBook;

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
  columns: {
    flexDirection: 'column',
  },
  columnsRow: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
  dividerVertical: {
    width: 1,
    backgroundColor: colors.borderColor,
    marginHorizontal: spacing.sm,
  },
  dividerHorizontal: {
    height: 1,
    backgroundColor: colors.borderColor,
    marginVertical: spacing.sm,
  },
  columnTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
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
  bidPrice: {
    color: colors.buyColor,
    fontWeight: '600',
  },
  askPrice: {
    color: colors.sellColor,
    fontWeight: '600',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    textAlign: 'center',
    padding: spacing.md,
  },
  errorText: {
    color: colors.errorColor,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
  },
});
