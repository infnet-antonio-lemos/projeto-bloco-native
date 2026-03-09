import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import BinanceMarketData from '../../components/Binance/BinanceMarketData';
import { colors } from '../../constants/theme';

export default function BinanceSymbolScreen() {
  const { symbol } = useLocalSearchParams();
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <BinanceMarketData symbol={symbol} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundDark },
});
