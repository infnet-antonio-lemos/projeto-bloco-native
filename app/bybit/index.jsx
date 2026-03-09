import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BybitPriceList from '../../components/Bybit/BybitPriceList';
import { colors } from '../../constants/theme';

export default function BybitPairsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <BybitPriceList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundDark },
});
