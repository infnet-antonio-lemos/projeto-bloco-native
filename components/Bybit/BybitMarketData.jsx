import { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import MarketData from '../Shared/MarketData';
import OrderBook from '../Shared/OrderBook';
import RecentTrades from '../Shared/RecentTrades';
import LastPriceCard from '../Shared/LastPriceCard';
import { colors, spacing, fontSize } from '../../constants/theme';

const INTERVALS = [
  { value: '1', label: '1m' },
  { value: '5', label: '5m' },
  { value: '15', label: '15m' },
  { value: '60', label: '1h' },
  { value: '240', label: '4h' },
  { value: 'D', label: '1d' },
  { value: 'W', label: '1w' },
  { value: 'M', label: '1M' },
];
const LIMITS = [1, 5, 10, 20, 50, 100, 200];

const BybitMarketData = ({ symbol }) => {
  const router = useRouter();
  const [orderBook, setOrderBook] = useState(null);
  const [trades, setTrades] = useState([]);
  const [klines, setKlines] = useState([]);
  const [klineInterval, setKlineInterval] = useState('60');
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [klinesRes, tradesRes, orderBookRes] = await Promise.all([
          fetch(`https://api.bybit.com/v5/market/kline?category=spot&symbol=${symbol}&interval=${klineInterval}&limit=${limit}`),
          fetch(`https://api.bybit.com/v5/market/recent-trade?category=spot&symbol=${symbol}&limit=20`),
          fetch(`https://api.bybit.com/v5/market/orderbook?category=spot&symbol=${symbol}&limit=10`),
        ]);

        const [klinesData, tradesData, orderBookData] = await Promise.all([
          klinesRes.json(),
          tradesRes.json(),
          orderBookRes.json(),
        ]);

        if (klinesData.retCode !== 0) throw new Error(klinesData.retMsg);
        if (tradesData.retCode !== 0) throw new Error(tradesData.retMsg);
        if (orderBookData.retCode !== 0) throw new Error(orderBookData.retMsg);

        setKlines(klinesData.result.list);
        setTrades(tradesData.result.list);
        setOrderBook(orderBookData.result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, [symbol, klineInterval, limit]);

  if (loading && !orderBook) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando {symbol}...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro: {error}</Text>
      </View>
    );
  }

  const formattedTrades = trades.map(trade => ({
    price: trade.price,
    amount: trade.size,
    time: parseInt(trade.time),
    side: trade.side.toLowerCase(),
  }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Voltar */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backBtnText}>← Voltar para Lista de Preços</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>Bybit — {symbol}</Text>

      <LastPriceCard
        symbol={symbol}
        price={formattedTrades[0]?.price}
        loading={loading}
        error={error}
      />

      <MarketData
        data={klines}
        loading={loading}
        error={error}
        intervals={INTERVALS}
        currentInterval={klineInterval}
        onIntervalChange={setKlineInterval}
        limits={LIMITS}
        currentLimit={limit}
        onLimitChange={setLimit}
        itemsPerPage={5}
      />

      <OrderBook
        bids={orderBook?.b}
        asks={orderBook?.a}
        loading={loading}
        error={error}
      />

      <RecentTrades
        data={formattedTrades}
        loading={loading}
        error={error}
      />
    </ScrollView>
  );
};

export default BybitMarketData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  content: {
    padding: spacing.lg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundDark,
    gap: spacing.md,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  errorText: {
    color: colors.errorColor,
    fontSize: fontSize.md,
    textAlign: 'center',
    padding: spacing.lg,
  },
  backBtn: {
    marginBottom: spacing.lg,
  },
  backBtnText: {
    color: colors.primary,
    fontSize: fontSize.md,
  },
  pageTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
});
