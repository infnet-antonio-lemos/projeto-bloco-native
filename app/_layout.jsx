import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: colors.secondary },
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.textPrimary, fontWeight: 'bold' },
          drawerStyle: { backgroundColor: colors.backgroundCard },
          drawerLabelStyle: { color: colors.textPrimary },
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.textSecondary,
        }}
      >
        <Drawer.Screen
          name="index"
          options={{ title: 'CryptoView', drawerLabel: 'Exchanges' }}
        />
        <Drawer.Screen
          name="binance"
          options={{ title: 'Binance', drawerLabel: 'Binance 🟡', headerShown: false }}
        />
        <Drawer.Screen
          name="bybit"
          options={{ title: 'Bybit', drawerLabel: 'Bybit 🟠', headerShown: false }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
