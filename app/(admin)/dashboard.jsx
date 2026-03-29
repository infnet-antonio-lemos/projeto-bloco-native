import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🔒 Painel Administrativo</Text>
        <Text style={styles.welcome}>
          Bem-vindo, <Text style={styles.welcomeName}>{user?.displayName}</Text>
        </Text>
      </View>

      {/* Cards */}
      <View style={styles.grid}>
        {/* Users card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Usuários</Text>
          <Text style={styles.cardValue}>3</Text>
          <Text style={styles.cardLabel}>contas registradas</Text>
        </View>

        {/* Roles card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Perfis de Acesso</Text>
          <View style={styles.rolesList}>
            <View style={styles.roleRow}>
              <View style={[styles.roleBadge, styles.roleBadgeAdmin]}>
                <Text style={[styles.roleBadgeText, styles.roleBadgeTextAdmin]}>admin</Text>
              </View>
              <Text style={styles.roleDesc}>— acesso total</Text>
            </View>
            <View style={styles.roleRow}>
              <View style={[styles.roleBadge, styles.roleBadgeUser]}>
                <Text style={[styles.roleBadgeText, styles.roleBadgeTextUser]}>user</Text>
              </View>
              <Text style={styles.roleDesc}>— acesso padrão</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  content: {
    padding: spacing.xl,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  welcome: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  welcomeName: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  grid: {
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  cardTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  cardValue: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 48,
    marginBottom: spacing.xs,
  },
  cardLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  rolesList: {
    gap: spacing.md,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  roleBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  roleBadgeAdmin: {
    backgroundColor: 'rgba(240, 185, 11, 0.15)',
    borderColor: 'rgba(240, 185, 11, 0.4)',
  },
  roleBadgeUser: {
    backgroundColor: 'rgba(99, 179, 237, 0.15)',
    borderColor: 'rgba(99, 179, 237, 0.4)',
  },
  roleBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  roleBadgeTextAdmin: {
    color: '#f0b90b',
  },
  roleBadgeTextUser: {
    color: '#63b3ed',
  },
  roleDesc: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
});

