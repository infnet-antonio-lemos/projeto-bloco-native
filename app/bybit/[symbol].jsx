import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, fontSize, spacing } from '../../constants/theme';

export default function BybitSymbolScreen() {
  const { symbol } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Carregando {symbol}...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundDark, alignItems: 'center', justifyContent: 'center' },
  text: { color: colors.textPrimary, fontSize: fontSize.lg, padding: spacing.lg },
});
