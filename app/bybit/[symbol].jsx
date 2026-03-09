import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import BybitMarketData from '../../components/Bybit/BybitMarketData';
import { colors } from '../../constants/theme';

export default function BybitSymbolScreen() {
  const { symbol } = useLocalSearchParams();
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <BybitMarketData symbol={symbol} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundDark },
});
