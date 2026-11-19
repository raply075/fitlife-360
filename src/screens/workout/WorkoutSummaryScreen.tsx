import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { WorkoutStackParamList, MainTabParamList } from '../../navigation/types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Header, Card, Badge, Button } from '../../components';
import { useWorkoutStore, useAuthStore } from '../../store';
import { formatDurationIndo, formatNumberId } from '../../utils';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme';

type WorkoutSummaryNavProp = NativeStackNavigationProp<WorkoutStackParamList, 'WorkoutSummary'>;
type WorkoutSummaryRouteProp = RouteProp<WorkoutStackParamList, 'WorkoutSummary'>;

interface Props {
  navigation: WorkoutSummaryNavProp;
  route: WorkoutSummaryRouteProp;
}

export const WorkoutSummaryScreen: React.FC<Props> = ({ navigation, route }) => {
  const tabNavigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { user } = useAuthStore();
  const { saveWorkoutSession } = useWorkoutStore();

  const distanceKm = route.params?.distanceKm ?? 3.42;
  const durationSeconds = route.params?.durationSeconds ?? 1458; // 24m 18s
  const caloriesBurned = route.params?.caloriesBurned ?? 245;
  const avgPace = route.params?.avgPace ?? '7\'06"/km';

  const handleSaveAndGoToProgress = async () => {
    // Simpan data workout ke store mock
    await saveWorkoutSession({
      userId: user?.id || 'user-sarah-putri-01',
      workoutType: 'running',
      title: 'Lari Santai Komplek',
      durationSeconds,
      distanceKm,
      caloriesBurned,
      avgPace,
      elevationGainM: 24,
      gpsAccuracyPct: 99.4,
      routeWaypoints: [],
    });

    // Navigasi ke tab Progres sesuai alur
    tabNavigation.navigate('ProgressTab');
  };

  const handleBackToHome = () => {
    tabNavigation.navigate('HomeTab');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Ringkasan Aktivitas Lari"
        subtitle="Sesi berhasil diselesaikan dengan baik!"
        onBack={() => navigation.navigate('WorkoutList')}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Badge label="LAYAR 13 - WORKOUT SUMMARY" variant="blue" />
        <Text style={styles.title}>Lari Santai Komplek</Text>
        <Text style={styles.timestamp}>Hari Ini • Rute Komplek Perumahan</Text>

        {/* Hero Distance Card */}
        <Card variant="lari" style={styles.heroCard}>
          <Text style={styles.distValue}>{formatNumberId(distanceKm, 2)}</Text>
          <Text style={styles.distUnit}>Kilometer (km)</Text>
          <Badge label="GPS Akurasi: 99,4%" variant="green" />
        </Card>

        {/* 3 Metric Cards Grid */}
        <View style={styles.metricsGrid}>
          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>Durasi Lari</Text>
            <Text style={styles.metricVal}>{formatDurationIndo(durationSeconds)}</Text>
          </Card>
          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>Pace Rata-rata</Text>
            <Text style={styles.metricVal}>{avgPace}</Text>
          </Card>
          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>Kalori Terbakar</Text>
            <Text style={styles.metricVal}>{caloriesBurned} kkal</Text>
          </Card>
          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>Elevasi Rute</Text>
            <Text style={styles.metricVal}>+24 m</Text>
          </Card>
        </View>

        {/* Route Waypoints Card */}
        <Card style={styles.routeCard}>
          <Text style={styles.routeHeader}>📍 Rute & Waypoints Terlewati:</Text>
          <View style={styles.routeWaypointsRow}>
            <Text style={styles.waypointItem}>Start Komplek</Text>
            <Text style={styles.waypointArrow}>➔</Text>
            <Text style={styles.waypointItem}>Pos 1</Text>
            <Text style={styles.waypointArrow}>➔</Text>
            <Text style={styles.waypointItem}>Jalur Hijau</Text>
            <Text style={styles.waypointArrow}>➔</Text>
            <Text style={styles.waypointFinish}>Finish 🏁</Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            testID="btn_simpan_progres"
            title="Simpan & Lihat Progres →"
            size="lg"
            onPress={handleSaveAndGoToProgress}
            style={styles.saveBtn}
          />
          <Button
            testID="btn_kembali_beranda"
            title="Kembali ke Beranda"
            variant="outline"
            size="md"
            onPress={handleBackToHome}
          />
        </View>
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
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: fontWeight.black,
    color: colors.slate,
    marginTop: spacing.xs,
  },
  timestamp: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
  },
  distValue: {
    fontSize: 54,
    fontWeight: fontWeight.black,
    color: colors.info,
  },
  distUnit: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textInfo,
    marginBottom: spacing.sm,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  metricCard: {
    width: '48%',
    padding: spacing.md,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  metricVal: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.slate,
  },
  routeCard: {
    padding: spacing.md,
    backgroundColor: colors.white,
    marginBottom: spacing.lg,
  },
  routeHeader: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.slate,
    marginBottom: spacing.sm,
  },
  routeWaypointsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.xs,
  },
  waypointItem: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.slateLight,
    backgroundColor: colors.borderLight,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.xs,
  },
  waypointArrow: {
    color: colors.primary,
    fontWeight: fontWeight.bold,
    fontSize: 12,
  },
  waypointFinish: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.forest,
    backgroundColor: colors.cardHijau,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.xs,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
  },
  saveBtn: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
});
