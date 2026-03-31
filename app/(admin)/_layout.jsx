import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/theme';

export default function AdminLayout() {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (!hasRole('admin')) {
      router.replace('/');
    }
  }, [isAuthenticated, loading]);

  if (loading || !isAuthenticated || !hasRole('admin')) return null;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.secondary },
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.textPrimary, fontWeight: 'bold' },
        contentStyle: { backgroundColor: colors.backgroundDark },
        headerLeft: () => <DrawerToggleButton tintColor={colors.primary} />,
      }}
    >
      <Stack.Screen name="dashboard" options={{ title: 'Painel Administrativo' }} />
    </Stack>
  );
}
