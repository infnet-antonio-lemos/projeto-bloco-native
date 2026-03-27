import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import MarketData from '../Shared/MarketData';
import OrderBook from '../Shared/OrderBook';
import RecentTrades from '../Shared/RecentTrades';
import LastPriceCard from '../Shared/LastPriceCard';
import { colors, spacing, fontSize } from '../../constants/theme';

const INTERVALS = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '12h', '1d', '1w', '1M'];
const LIMITS = [1, 5, 10, 20, 50, 100];

const BinanceMarketData = ({ symbol }) => {
  const [orderBook, setOrderBook] = useState(null);
  const [trades, setTrades] = useState([]);
  const [klinesData, setKlinesData] = useState([]);
  const [klinesInterval, setKlinesInterval] = useState('1d');
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!symbol) return;
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const [orderBookRes, tradesRes, klinesRes] = await Promise.all([
        fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=10`),
        fetch(`https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=10`),
        fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${klinesInterval}&limit=${limit}`),
      ]);

      if (!orderBookRes.ok || !tradesRes.ok || !klinesRes.ok) {
        throw new Error('Falha ao buscar dados');
      }

      const [orderBookData, tradesData, klinesRaw] = await Promise.all([
        orderBookRes.json(),
        tradesRes.json(),
        klinesRes.json(),
      ]);

      setOrderBook(orderBookData);
      setTrades(tradesData);
      setKlinesData(klinesRaw);
    } catch (err) {
      setError(err.message);
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  }, [symbol, klinesInterval, limit]);

  const handleRefresh = useCallback(() => fetchData(true), [fetchData]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => fetchData(), 5000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

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
    amount: trade.qty,
    time: trade.time,
    side: trade.isBuyerMaker ? 'sell' : 'buy',
  }));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      <Text style={styles.pageTitle}>Binance — {symbol}</Text>

      <LastPriceCard
        symbol={symbol}
        price={formattedTrades[formattedTrades.length - 1]?.price}
        loading={loading}
        error={error}
      />

      <MarketData
        data={klinesData}
        loading={loading}
        error={error}
        intervals={INTERVALS}
        currentInterval={klinesInterval}
        onIntervalChange={setKlinesInterval}
        limits={LIMITS}
        currentLimit={limit}
        onLimitChange={setLimit}
        itemsPerPage={5}
        symbol={symbol}
      />

      <OrderBook
        bids={orderBook?.bids}
        asks={orderBook?.asks}
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

export default BinanceMarketData;

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
  pageTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
});
