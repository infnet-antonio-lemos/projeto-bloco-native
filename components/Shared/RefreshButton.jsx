import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize } from '../../constants/theme';

const RefreshButton = ({ onPress, loading = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.buttonDisabled]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.secondary} />
      ) : (
        <Text style={styles.text}>Atualizar</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
    height: 50, // Match typical input height
  },
  buttonDisabled: {
    backgroundColor: colors.primaryDark,
    opacity: 0.7,
  },
  text: {
    color: colors.secondary,
    fontWeight: '600',
    fontSize: fontSize.md,
  },
});

export default RefreshButton;
