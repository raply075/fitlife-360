import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import Svg, { Line, Circle, Text as SvgText, Rect } from 'react-native-svg';
import { Header, Card, Badge, Button, ProgressBar } from '../../components';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme';
import { formatNumberId } from '../../utils';

type PeriodType = 'minggu' | 'bulan' | 'tahun';

const WEIGHT_DATA_WEEK = [
  { day: 'Sen', weight: 63.0 },
  { day: 'Sel', weight: 62.8 },
  { day: 'Rab', weight: 62.6 },
  { day: 'Kam', weight: 62.5 },
  { day: 'Jum', weight: 62.4 }, // Hari ini
  { day: 'Sab', weight: 62.3 },
  { day: 'Min', weight: 62.2 },
];

export const ProgressScreen: React.FC = () => {
  const [period, setPeriod] = useState<PeriodType>('minggu');

  const screenWidth = Dimensions.get('window').width - 48;
  const chartHeight = 160;
  const targetWeight = 58.0;

  const handleExportPdf = () => {
    Alert.alert(
      'Ekspor Dokumen PDF',
      'Fitur Ekspor Ringkasan Mingguan (PDF) segera hadir pada rilis berikutnya.',
      [{ text: 'Mengerti', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Laporan & Statistik"
        subtitle="Analisis pencapaian kebugaran berkala"
        rightAction={
          <Button
            testID="btn_ekspor_pdf"
            title="Ekspor PDF"
            size="sm"
            variant="outline"
            onPress={handleExportPdf}
          />
        }
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Period Selector Tabs */}
        <View style={styles.periodTabsRow}>
          {(['minggu', 'bulan', 'tahun'] as PeriodType[]).map((p) => {
            const isSelected = period === p;
            return (
              <TouchableOpacity
                key={p}
                onPress={() => setPeriod(p)}
                style={[styles.periodTab, isSelected ? styles.periodTabActive : null]}
              >
                <Text style={[styles.periodText, isSelected ? styles.periodTextActive : null]}>
                  {p === 'minggu' ? 'Mingguan' : p === 'bulan' ? 'Bulanan' : 'Tahunan'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Weight Trend Chart Card with react-native-svg */}
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartSubtitle}>Tren Berat Badan</Text>
              <Text style={styles.currentWeightText}>
                62,4 <Text style={styles.weightUnit}>kg</Text>{' '}
                <Text style={styles.weightLossTag}>(↓ 0,6 kg minggu ini)</Text>
              </Text>
            </View>
            <Badge label="TARGET 58,0 KG" variant="green" />
          </View>

          {/* SVG Line Chart */}
          <View style={styles.svgWrapper}>
            <Svg width={screenWidth} height={chartHeight}>
              {/* Background Target Line */}
              <Line
                x1={20}
                y1={130}
                x2={screenWidth - 20}
                y2={130}
                stroke={colors.primaryLight}
                strokeWidth={1.5}
                strokeDasharray="4,4"
              />
              <SvgText
                x={screenWidth - 25}
                y={125}
                fill={colors.forest}
                fontSize={10}
                textAnchor="end"
                fontWeight="bold"
              >
                Target 58 kg
              </SvgText>

              {/* Data Points & Connecting Lines */}
              {WEIGHT_DATA_WEEK.map((item, idx) => {
                const stepX = (screenWidth - 60) / (WEIGHT_DATA_WEEK.length - 1);
                const x = 30 + idx * stepX;
                // Skala visual tinggi: berat 63kg di y=30, 62kg di y=100
                const y = 30 + (63.2 - item.weight) * 70;

                const nextItem = WEIGHT_DATA_WEEK[idx + 1];
                const nextX = 30 + (idx + 1) * stepX;
                const nextY = nextItem ? 30 + (63.2 - nextItem.weight) * 70 : y;

                return (
                  <React.Fragment key={item.day}>
                    {nextItem && (
                      <Line
                        x1={x}
                        y1={y}
                        x2={nextX}
                        y2={nextY}
                        stroke={colors.primary}
                        strokeWidth={3}
                      />
                    )}
                    <Circle
                      cx={x}
                      cy={y}
                      r={item.day === 'Jum' ? 6 : 4}
                      fill={item.day === 'Jum' ? colors.forest : colors.white}
                      stroke={colors.primary}
                      strokeWidth={2}
                    />
                    <SvgText
                      x={x}
                      y={chartHeight - 10}
                      fill={item.day === 'Jum' ? colors.forest : colors.textMuted}
                      fontSize={11}
                      textAnchor="middle"
                      fontWeight={item.day === 'Jum' ? 'bold' : 'normal'}
                    >
                      {item.day}
                    </SvgText>
                  </React.Fragment>
                );
              })}
            </Svg>
          </View>
        </Card>

        {/* Weekly Running Distance Progress */}
        <Card variant="lari" style={styles.runningProgressCard}>
          <View style={styles.runTop}>
            <View>
              <Text style={styles.runLabel}>Akumulasi Lari Minggu Ini</Text>
              <Text style={styles.runValue}>
                21,5 <Text style={styles.runUnit}>/ 25,0 km</Text>
              </Text>
            </View>
            <Badge label="86% SELESAI" variant="blue" />
          </View>

          <ProgressBar progress={21.5 / 25.0} color={colors.info} height={10} />

          <View style={styles.runDetailsRow}>
            <Text style={styles.runDetailText}>Total Waktu Olahraga: 5,2 Jam</Text>
            <Text style={styles.runDetailGoal}>Target: 5,0 Jam (Tercapai!)</Text>
          </View>
        </Card>

        {/* Secondary Metrics 3-Card Grid */}
        <Text style={styles.sectionHeader}>Metrik Pendukung Kesehatan</Text>
        <View style={styles.metricsGrid}>
          <Card style={styles.metricCard}>
            <Text style={styles.metricIcon}>🔥</Text>
            <Text style={styles.metricLabel}>Total Kalori</Text>
            <Text style={styles.metricVal}>1.480</Text>
            <Text style={styles.metricSub}>kkal terbakar</Text>
          </Card>
          <Card style={styles.metricCard}>
            <Text style={styles.metricIcon}>👣</Text>
            <Text style={styles.metricLabel}>Total Langkah</Text>
            <Text style={styles.metricVal}>28.400</Text>
            <Text style={styles.metricSub}>langkah kaki</Text>
          </Card>
          <Card style={styles.metricCard}>
            <Text style={styles.metricIcon}>😴</Text>
            <Text style={styles.metricLabel}>Waktu Tidur</Text>
            <Text style={styles.metricVal}>7,4</Text>
            <Text style={styles.metricSub}>jam / malam</Text>
          </Card>
        </View>

        {/* Bottom PDF Export Button */}
        <Button
          testID="btn_ekspor_pdf_bottom"
          title="📄 Ekspor Ringkasan Mingguan (PDF)"
          size="lg"
          onPress={handleExportPdf}
          style={styles.exportBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
  },
  periodTabsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  periodTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  periodTabActive: {
    backgroundColor: colors.primary,
  },
  periodText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
  },
  periodTextActive: {
    color: colors.white,
  },
  chartCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  chartSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold,
  },
  currentWeightText: {
    fontSize: 28,
    fontWeight: fontWeight.black,
    color: colors.slate,
    marginTop: 2,
  },
  weightUnit: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.normal,
  },
  weightLossTag: {
    fontSize: fontSize.xs,
    color: colors.forest,
    fontWeight: fontWeight.bold,
  },
  svgWrapper: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  runningProgressCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
  },
  runTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  runLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textInfo,
  },
  runValue: {
    fontSize: 26,
    fontWeight: fontWeight.black,
    color: colors.slate,
    marginTop: 2,
  },
  runUnit: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.normal,
  },
  runDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  runDetailText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  runDetailGoal: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
    color: colors.forest,
  },
  sectionHeader: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.slate,
    marginBottom: spacing.sm,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  metricIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold,
  },
  metricVal: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.black,
    color: colors.slate,
    marginVertical: 2,
  },
  metricSub: {
    fontSize: 9,
    color: colors.textMuted,
  },
  exportBtn: {
    marginBottom: spacing.xxl,
  },
});
