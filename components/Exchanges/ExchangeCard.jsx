import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';

const ExchangeCard = ({ exchange }) => {
  const router = useRouter();

  const handleDetailsClick = () => {
    if (exchange.id === 'binance') {
      router.push('/binance');
    } else if (exchange.id === 'bybit') {
      router.push('/bybit');
    } else {
      Alert.alert('Em breve', `Detalhes para ${exchange.name} em breve!`);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>{exchange.icon}</Text>
        <Text style={styles.name}>{exchange.name}</Text>
      </View>

      <Text style={styles.description}>{exchange.description}</Text>

      <View style={styles.stats}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Volume 24h:</Text>
          <Text style={styles.statValue}>{exchange.volume24h}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>País:</Text>
          <Text style={styles.statValue}>{exchange.country}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Pares:</Text>
          <Text style={styles.statValue}>{exchange.tradingPairs}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.status}>
          {exchange.status === 'active' ? '🟢 Ativo' : '🔴 Inativo'}
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleDetailsClick}>
          <Text style={styles.buttonText}>Ver Detalhes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ExchangeCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 28,
    marginRight: spacing.sm,
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  stats: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  status: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  buttonText: {
    color: colors.backgroundDark,
    fontWeight: 'bold',
    fontSize: fontSize.sm,
  },
});
