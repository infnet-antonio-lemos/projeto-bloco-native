import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { colors } from '../constants/theme';
import { AuthProvider, useAuth } from '../context/AuthContext';

function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const onLoginPage = segments[0] === 'login';
    if (!isAuthenticated && !onLoginPage) {
      router.replace('/login');
    } else if (isAuthenticated && onLoginPage) {
      router.replace('/');
    }
  }, [isAuthenticated, loading, segments]);

  if (loading) return null;

  return children;
}

function RootLayoutNav() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AuthGuard>
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
          <Drawer.Screen
            name="login"
            options={{
              title: 'Login',
              headerShown: false,
              drawerItemStyle: { display: 'none' },
            }}
          />
        </Drawer>
      </AuthGuard>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
