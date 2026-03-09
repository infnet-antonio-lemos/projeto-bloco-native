import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';

const ITEMS_PER_PAGE = 20;

const BinancePriceList = () => {
  const router = useRouter();
  const [prices, setPrices] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.binance.com/api/v3/ticker/price');
        if (!response.ok) throw new Error('Falha ao buscar dados');
        const data = await response.json();
        data.sort((a, b) => a.symbol.localeCompare(b.symbol));
        setPrices(data);
        setFilteredPrices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    const filtered = prices.filter(p =>
      p.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPrices(filtered);
    setCurrentPage(1);
  }, [searchTerm, prices]);

  const totalPages = Math.ceil(filteredPrices.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredPrices.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando preços...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Filtrar por símbolo (ex: BTCUSDT)..."
        placeholderTextColor={colors.textSecondary}
        value={searchTerm}
        onChangeText={setSearchTerm}
        autoCapitalize="characters"
      />

      {/* Cabeçalho da tabela */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.symbolCol]}>Símbolo</Text>
        <Text style={[styles.headerCell, styles.priceCol]}>Preço</Text>
      </View>

      <FlatList
        data={currentItems}
        keyExtractor={(item) => item.symbol}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.row, index % 2 === 0 && styles.rowAlt]}
            onPress={() => router.push(`/binance/${item.symbol}`)}
          >
            <Text style={[styles.cell, styles.symbolCol, styles.symbolText]}>
              {item.symbol}
            </Text>
            <Text style={[styles.cell, styles.priceCol]}>
              {parseFloat(item.price).toFixed(8)}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum resultado encontrado</Text>
        }
      />

      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
            onPress={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
          >
            <Text style={[styles.pageBtnText, currentPage === 1 && styles.pageBtnTextDisabled]}>← Anterior</Text>
          </TouchableOpacity>

          <Text style={styles.pageInfo}>
            {currentPage} / {totalPages}
          </Text>

          <TouchableOpacity
            style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
            onPress={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages}
          >
            <Text style={[styles.pageBtnText, currentPage === totalPages && styles.pageBtnTextDisabled]}>Próxima →</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default BinancePriceList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundDark,
    gap: spacing.md,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
  errorText: {
    color: colors.errorColor,
    fontSize: fontSize.md,
    textAlign: 'center',
    padding: spacing.lg,
  },
  searchInput: {
    backgroundColor: colors.backgroundCard,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: borderRadius.md,
    margin: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  headerCell: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: fontSize.sm,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  rowAlt: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  cell: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
  },
  symbolCol: {
    flex: 1,
  },
  priceCol: {
    flex: 1,
    textAlign: 'right',
  },
  symbolText: {
    color: colors.primary,
    fontWeight: '600',
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.xl,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderColor,
    backgroundColor: colors.backgroundCard,
  },
  pageBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  pageBtnDisabled: {
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  pageBtnText: {
    color: colors.backgroundDark,
    fontWeight: 'bold',
    fontSize: fontSize.sm,
  },
  pageBtnTextDisabled: {
    color: colors.textSecondary,
  },
  pageInfo: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },
});
