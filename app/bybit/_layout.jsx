import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { colors } from '../../constants/theme';

export default function BybitLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.secondary },
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.textPrimary },
        contentStyle: { backgroundColor: colors.backgroundDark },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Bybit — Pares',
          headerLeft: () => <DrawerToggleButton tintColor={colors.primary} />,
        }}
      />
      <Stack.Screen name="[symbol]" options={{ title: 'Detalhes do Par' }} />
    </Stack>
  );
}
