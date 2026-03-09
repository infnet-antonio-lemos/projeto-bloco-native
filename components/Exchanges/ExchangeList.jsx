import { View, Text, FlatList, StyleSheet } from 'react-native';
import ExchangeCard from './ExchangeCard';
import { exchanges } from '../../data/exchanges';
import { colors, spacing, fontSize } from '../../constants/theme';

const ExchangeList = () => {
  return (
    <FlatList
      data={exchanges}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ExchangeCard exchange={item} />}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Exchanges de Criptomoedas</Text>
          <Text style={styles.subtitle}>
            Explore as principais exchanges e corretoras de criptomoedas do mercado
          </Text>
        </View>
      }
    />
  );
};

export default ExchangeList;

const styles = StyleSheet.create({
  listContent: {
    padding: spacing.lg,
    backgroundColor: colors.backgroundDark,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
