import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';

/**
 * Último preço do par de criptomoedas.
 * Props: symbol, price, loading, error
 */
const LastPriceCard = ({ symbol, price, loading, error }) => {
  const formattedPrice = price
    ? parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })
    : '—';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>Último Preço</Text>
        <Text style={styles.symbol}>{symbol}</Text>
      </View>
      {loading && !price ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : error && !price ? (
        <Text style={styles.errorText}>Erro ao carregar</Text>
      ) : (
        <Text style={styles.price}>{formattedPrice}</Text>
      )}
    </View>
  );
};

export default LastPriceCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'column',
    gap: spacing.xs,
  },
  label: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  symbol: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  price: {
    color: colors.primary,
    fontSize: fontSize.xxl + 4,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  errorText: {
    color: colors.errorColor,
    fontSize: fontSize.sm,
  },
});
