import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BinancePriceList from '../../components/Binance/BinancePriceList';
import { colors } from '../../constants/theme';

export default function BinancePairsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <BinancePriceList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundDark },
});
