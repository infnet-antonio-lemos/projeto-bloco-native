import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

export default function BybitPairsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Carregando pares Bybit...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundDark, alignItems: 'center', justifyContent: 'center' },
  text: { color: colors.textPrimary },
});
