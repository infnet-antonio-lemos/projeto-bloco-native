import ExchangeList from '../components/Exchanges/ExchangeList';
import { View, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

export default function ExchangesScreen() {
  return (
    <View style={styles.container}>
      <ExchangeList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
});
