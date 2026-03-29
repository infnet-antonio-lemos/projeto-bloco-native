import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import PlatformPressable from '../Shared/PlatformPressable';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';

const formatVolume = (usd) => {
  if (usd >= 1e9) return `$${(usd / 1e9).toFixed(1)}B`;
  if (usd >= 1e6) return `$${(usd / 1e6).toFixed(1)}M`;
  return `$${usd.toFixed(0)}`;
};

const ExchangeCard = ({ exchange }) => {
  const router = useRouter();
  const [liveData, setLiveData] = useState(null);

  useEffect(() => {
    if (exchange.mock) return;

    const fetchLiveData = async () => {
      try {
        if (exchange.id === 'binance') {
          const [priceRes, tickerRes] = await Promise.all([
            fetch('https://api.binance.com/api/v3/ticker/price'),
            fetch('https://api.binance.com/api/v3/ticker/24hr?type=MINI'),
          ]);
          const prices = await priceRes.json();
          const tickers = await tickerRes.json();
          const tradingPairs = prices.length.toLocaleString('pt-BR');
          const volume = tickers
            .filter(t => t.symbol.endsWith('USDT'))
            .reduce((sum, t) => sum + parseFloat(t.quoteVolume), 0);
          setLiveData({ tradingPairs, volume24h: formatVolume(volume) });
        } else if (exchange.id === 'bybit') {
          const res = await fetch('https://api.bybit.com/v5/market/tickers?category=spot');
          const data = await res.json();
          if (data.retCode !== 0) return;
          const list = data.result.list;
          const tradingPairs = list.length.toLocaleString('pt-BR');
          const volume = list
            .filter(t => t.symbol.endsWith('USDT'))
            .reduce((sum, t) => sum + parseFloat(t.turnover24h || 0), 0);
          setLiveData({ tradingPairs, volume24h: formatVolume(volume) });
        }
      } catch {
        // on error, keep static data
      }
    };

    fetchLiveData();
  }, [exchange.id, exchange.mock]);

  const tradingPairs = liveData?.tradingPairs ?? exchange.tradingPairs;
  const volume24h = liveData?.volume24h ?? exchange.volume24h;

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
          <Text style={styles.statValue}>{volume24h}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Pares:</Text>
          <Text style={styles.statValue}>{tradingPairs}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.status}>
          {exchange.status === 'active' ? '🟢 Ativo' : '🔴 Inativo'}
        </Text>
        <PlatformPressable style={styles.button} onPress={handleDetailsClick}>
          <Text style={styles.buttonText}>Ver Detalhes</Text>
        </PlatformPressable>
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
