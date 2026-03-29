import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';

/**
 * Gráfico de linha de preços (fechamento) reutilizável.
 * Props: symbol, currentInterval, intervals, data
 * data: Array de klines — cada item é [timestamp, open, high, low, close, ...]
 */
const PriceChart = ({ symbol, currentInterval, intervals, data }) => {
  const [chartWidth, setChartWidth] = useState(0);

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>
          Aguardando dados de mercado para desenhar o gráfico...
        </Text>
      </View>
    );
  }

  // =========================================================
  // 1. ADAPTAÇÃO AO INTERVALO (Formatando o texto do Eixo X)
  // =========================================================
  const safeIntervals = intervals || [];

  const rawLabels = data.map(item => {
    const rawTimestamp = Array.isArray(item) ? item[0] : item.time;
    const date = new Date(Number(rawTimestamp));
    const timeRange = String(currentInterval).toLowerCase();

    const intervalIndex = safeIntervals.findIndex(
      i => String(i).toLowerCase() === timeRange,
    );

    if ((intervalIndex >= 0 && intervalIndex <= 5) || timeRange.endsWith('m')) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if ((intervalIndex > 5 && intervalIndex <= 10) || timeRange.endsWith('h')) {
      return `${date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  });

  const chartPrices = data.map(item => {
    const price = Array.isArray(item) ? item[4] : item.close;
    return parseFloat(price);
  });

  // =========================================================
  // 2. ADAPTAÇÃO AO LIMITE (Calculando a densidade do Eixo X)
  // =========================================================
  const totalPoints = rawLabels.length;
  const firstLabel = rawLabels[0] || '';
  const isLongLabel = firstLabel.length > 6;

  let maxLabels;
  if (!isLongLabel) {
    if (totalPoints <= 15) maxLabels = totalPoints;
    else if (totalPoints <= 50) maxLabels = 8;
    else maxLabels = 10;
  } else {
    if (totalPoints <= 6) maxLabels = totalPoints;
    else maxLabels = 4;
  }

  const step = Math.ceil(totalPoints / maxLabels);
  const displayLabels = rawLabels.map((label, i) => (i % step === 0 ? label : ''));

  const chartData = {
    labels: displayLabels,
    datasets: [{ data: chartPrices, color: () => colors.primary }],
  };

  const chartConfig = {
    backgroundColor: '#161624',
    backgroundGradientFrom: '#161624',
    backgroundGradientTo: '#161624',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 212, 255, ${opacity})`,
    labelColor: () => colors.textSecondary,
    fillShadowGradientOpacity: 0.15,
    fillShadowGradientToOpacity: 0,
    propsForDots: { r: '0' },
    propsForBackgroundLines: { stroke: 'rgba(255,255,255,0.05)' },
    propsForLabels: { fontSize: fontSize.xs },
  };

  const intervalDisplay =
    safeIntervals.find(i => (typeof i === 'object' ? i.value : i) === currentInterval)?.label ||
    currentInterval;

  return (
    <View
      style={styles.container}
      onLayout={e => setChartWidth(e.nativeEvent.layout.width - spacing.md * 2)}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Análise Gráfica: {symbol}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Intervalo: {intervalDisplay}</Text>
        </View>
      </View>

      {chartWidth > 0 && (
        <LineChart
          data={chartData}
          width={chartWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          withDots={false}
          withInnerLines={true}
          withOuterLines={false}
          withVerticalLines={false}
          style={styles.chart}
        />
      )}
    </View>
  );
};

export default PriceChart;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161624',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderColor,
    padding: spacing.md,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '600',
    flexShrink: 1,
  },
  badge: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  chart: {
    borderRadius: borderRadius.md,
    paddingRight: 0,
  },
  noDataText: {
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.lg,
    fontSize: fontSize.sm,
  },
});
