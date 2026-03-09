import { Stack } from 'expo-router';
import { colors } from '../../constants/theme';

export default function BinanceLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.secondary },
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.textPrimary },
        contentStyle: { backgroundColor: colors.backgroundDark },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Binance — Pares' }} />
      <Stack.Screen name="[symbol]" options={{ title: 'Detalhes do Par' }} />
    </Stack>
  );
}
