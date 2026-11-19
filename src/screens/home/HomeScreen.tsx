import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/types';
import { Card, Badge, ProgressBar, Button } from '../../components';
import { useProfileStore, useFoodStore, useWorkoutStore, useAuthStore } from '../../store';
import { formatNumberId, formatThousands } from '../../utils';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme';

type NavigationProp = BottomTabNavigationProp<MainTabParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();
  const { profile, fetchProfile } = useProfileStore();
  const { todaySummary, fetchTodayLogs } = useFoodStore();
  const { recentRun, fetchRecentRun } = useWorkoutStore();

  const currentUserId = user?.id || 'user-sarah-putri-01';

  useEffect(() => {
    fetchProfile(currentUserId);
    fetchTodayLogs(currentUserId);
    fetchRecentRun(currentUserId);
  }, [currentUserId, fetchProfile, fetchTodayLogs, fetchRecentRun]);

  // Data paten persona Sarah Putri untuk dasbor sentral
  const dailyTargetCalories = profile?.dailyCalorieTarget || 1800;
  // Sesuai spesifikasi paten: Kalori 420 / 1.800 kkal (Protein 72g, Karbo 180g, Lemak 54g)
  const consumedCalories = todaySummary.totalCalories > 0 ? todaySummary.totalCalories : 420;
  const currentWeight = profile?.currentWeight || 62.4;
  const targetWeight = profile?.targetWeight || 58.0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* Top Header Bar */}
      <View style={styles.topHeader}>
        <View style={styles.userProfileRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>SP</Text>
          </View>
          <View>
            <Text style={styles.greetingText}>Halo, Sarah Putri! 👋</Text>
            <Text style={styles.subtitleText}>Mari lanjutkan gaya hidup sehat hari ini</Text>
          </View>
        </View>
        <Badge label="LEVEL 12" variant="green" />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Calorie Ring Summary Card */}
        <Card variant="hijau" style={styles.calorieCard}>
          <View style={styles.calorieHeader}>
            <View>
              <Text style={styles.calorieCardTitle}>Target Asupan Kalori Harian</Text>
              <Text style={styles.calorieNumbers}>
                {consumedCalories}{' '}
                <Text style={styles.calorieTarget}>/ {dailyTargetCalories} kkal</Text>
              </Text>
            </View>
            <View style={styles.caloriePercentBadge}>
              <Text style={styles.caloriePercentText}>
                {Math.round((consumedCalories / dailyTargetCalories) * 100)}%
              </Text>
            </View>
          </View>

          <ProgressBar
            progress={consumedCalories / dailyTargetCalories}
            color={colors.primary}
            height={10}
          />

          {/* Makro Row */}
          <View style={styles.macroRow}>
            <View style={styles.macroBox}>
              <Text style={styles.macroVal}>72g</Text>
              <Text style={styles.macroLbl}>Protein</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={styles.macroVal}>180g</Text>
              <Text style={styles.macroLbl}>Karbohidrat</Text>
            </View>
            <View style={styles.macroBox}>
              <Text style={styles.macroVal}>54g</Text>
              <Text style={styles.macroLbl}>Lemak Sehat</Text>
            </View>
          </View>

          <Button
            testID="btn_shortcut_makanan"
            title="Catat Makanan Baru ➔"
            variant="outline"
            size="sm"
            onPress={() => navigation.navigate('FoodTab', { screen: 'AddFoodModal' })}
            style={styles.cardBtn}
          />
        </Card>

        {/* 2-Column Metrics: Berat Badan & Langkah */}
        <View style={styles.statsRow}>
          <Card style={styles.statCol}>
            <Text style={styles.statIcon}>⚖️</Text>
            <Text style={styles.statLabel}>Berat Badan</Text>
            <Text style={styles.statValue}>
              {formatNumberId(currentWeight)}{' '}
              <Text style={styles.statSub}>kg</Text>
            </Text>
            <Text style={styles.statTarget}>Target: {formatNumberId(targetWeight)} kg</Text>
          </Card>

          <Card style={styles.statCol}>
            <Text style={styles.statIcon}>👣</Text>
            <Text style={styles.statLabel}>Langkah Kaki</Text>
            <Text style={styles.statValue}>
              {formatThousands(6240)}
            </Text>
            <Text style={styles.statTarget}>Target: 10.000 langkah</Text>
          </Card>
        </View>

        {/* Activity Target Card */}
        <Card style={styles.activityCard}>
          <Text style={styles.sectionTitle}>Target Aktivitas Hari Ini</Text>
          <View style={styles.activityProgressRow}>
            <View style={styles.actItem}>
              <Text style={styles.actLabel}>Jarak Tempuh</Text>
              <Text style={styles.actValue}>4,82 km <Text style={styles.actSub}>(80%)</Text></Text>
              <ProgressBar progress={0.8} color={colors.info} height={6} />
            </View>
            <View style={styles.actDivider} />
            <View style={styles.actItem}>
              <Text style={styles.actLabel}>Waktu Latihan</Text>
              <Text style={styles.actValue}>52 Menit <Text style={styles.actSub}>(87%)</Text></Text>
              <ProgressBar progress={0.87} color={colors.forest} height={6} />
            </View>
          </View>
        </Card>

        {/* Last Running Session Card */}
        <Card variant="lari" style={styles.lastRunCard}>
          <View style={styles.lastRunHeader}>
            <View>
              <Badge label="SESI TERAKHIR" variant="blue" />
              <Text style={styles.lastRunTitle}>Lari Santai Komplek</Text>
            </View>
            <Text style={styles.runBadgeIcon}>🏃‍♀️</Text>
          </View>

          <View style={styles.lastRunMetrics}>
            <View style={styles.runMetric}>
              <Text style={styles.runMetricVal}>3,42</Text>
              <Text style={styles.runMetricLbl}>km</Text>
            </View>
            <View style={styles.runMetric}>
              <Text style={styles.runMetricVal}>24m 18s</Text>
              <Text style={styles.runMetricLbl}>durasi</Text>
            </View>
            <View style={styles.runMetric}>
              <Text style={styles.runMetricVal}>245</Text>
              <Text style={styles.runMetricLbl}>kkal</Text>
            </View>
          </View>

          <Button
            testID="btn_quick_run"
            title="Mulai Sesi Lari GPS ➔"
            size="md"
            onPress={() => navigation.navigate('WorkoutTab', { screen: 'ActiveTracker' })}
            style={styles.cardBtn}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  userProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.black,
  },
  greetingText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.slate,
  },
  subtitleText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  content: {
    padding: spacing.lg,
  },
  calorieCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
  },
  calorieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  calorieCardTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.forest,
  },
  calorieNumbers: {
    fontSize: 30,
    fontWeight: fontWeight.black,
    color: colors.slate,
    marginTop: 2,
  },
  calorieTarget: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.normal,
  },
  caloriePercentBadge: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  caloriePercentText: {
    color: colors.forest,
    fontWeight: fontWeight.black,
    fontSize: fontSize.sm,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  macroBox: {
    alignItems: 'center',
    flex: 1,
  },
  macroVal: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.slate,
  },
  macroLbl: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  cardBtn: {
    marginTop: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statCol: {
    flex: 1,
    padding: spacing.md,
  },
  statIcon: {
    fontSize: 22,
    marginBottom: spacing.xxs,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold,
  },
  statValue: {
    fontSize: 22,
    fontWeight: fontWeight.black,
    color: colors.slate,
    marginVertical: 2,
  },
  statSub: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal,
    color: colors.textSecondary,
  },
  statTarget: {
    fontSize: 10,
    color: colors.textMuted,
  },
  activityCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.slate,
    marginBottom: spacing.sm,
  },
  activityProgressRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actItem: {
    flex: 1,
  },
  actLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  actValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.slate,
    marginVertical: 4,
  },
  actSub: {
    fontSize: 11,
    color: colors.primary,
  },
  actDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  lastRunCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
  },
  lastRunHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastRunTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.slate,
    marginTop: spacing.xxs,
  },
  runBadgeIcon: {
    fontSize: 32,
  },
  lastRunMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginVertical: spacing.md,
  },
  runMetric: {
    alignItems: 'center',
  },
  runMetricVal: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.info,
  },
  runMetricLbl: {
    fontSize: 10,
    color: colors.textMuted,
  },
});
