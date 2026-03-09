import { View, Text, FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import ExchangeCard from './ExchangeCard';
import { exchanges } from '../../data/exchanges';
import { colors, spacing, fontSize } from '../../constants/theme';

const ExchangeList = () => {
  const { width } = useWindowDimensions();
  const numColumns = width >= 600 ? 2 : 1;

  return (
    <FlatList
      data={exchanges}
      key={numColumns} // força re-render ao mudar colunas
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <View style={[styles.cardWrapper, numColumns === 2 && styles.cardWrapperHalf]}>
          <ExchangeCard exchange={item} />
        </View>
      )}
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
  cardWrapper: {
    flex: 1,
  },
  cardWrapperHalf: {
    flex: 0.5,
    marginHorizontal: spacing.xs,
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
