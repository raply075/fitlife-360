import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from '../../navigation/types';
import { Header, Card, Button, Badge, ProgressBar } from '../../components';
import { useWorkoutStore, useAuthStore } from '../../store';
import { formatNumberId, formatDurationIndo } from '../../utils';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme';

type WorkoutScreenNavProp = NativeStackNavigationProp<WorkoutStackParamList, 'WorkoutList'>;

interface Props {
  navigation: WorkoutScreenNavProp;
}

const CATEGORIES = [
  { id: 'cat-cardio', name: 'Cardio', icon: '🏃‍♂️', count: '12 Sesi' },
  { id: 'cat-strength', name: 'Strength', icon: '🏋️‍♀️', count: '8 Sesi' },
  { id: 'cat-yoga', name: 'Yoga & Flex', icon: '🧘‍♀️', count: '5 Sesi' },
];

export const WorkoutScreen: React.FC<Props> = ({ navigation }) => {
  const { workouts, fetchWorkouts } = useWorkoutStore();
  const { user } = useAuthStore();
  const currentUserId = user?.id || 'user-sarah-putri-01';

  useEffect(() => {
    fetchWorkouts(currentUserId);
  }, [currentUserId, fetchWorkouts]);

  const targetKm = 25.0;
  const currentKm = 18.2; // Sesuai spesifikasi paten: layar latihan 18,2 km (73%)
  const progressRatio = currentKm / targetKm;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Katalog & Sesi Latihan"
        subtitle="Raih target kebugaran mingguan Anda"
        rightAction={
          <Button
            testID="btn_mulai_lari"
            title="Mulai Lari ➔"
            size="sm"
            onPress={() => navigation.navigate('ActiveTracker')}
          />
        }
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Weekly Target Progress Card */}
        <Card variant="lari" style={styles.targetCard}>
          <View style={styles.targetHeader}>
            <View>
              <Text style={styles.targetSub}>Target Lari Mingguan</Text>
              <Text style={styles.targetMain}>
                {formatNumberId(currentKm, 1)} <Text style={styles.targetUnit}>/ {targetKm} km</Text>
              </Text>
            </View>
            <Badge label="73% TERCAPAI" variant="blue" />
          </View>

          <ProgressBar progress={progressRatio} color={colors.info} height={10} />

          <View style={styles.targetFooter}>
            <Text style={styles.footerNote}>Sisa 6,8 km untuk mencapai target minggu ini</Text>
            <Text style={styles.footerTime}>Waktu: 3,8 / 5,0 Jam</Text>
          </View>
        </Card>

        {/* Categories Section */}
        <Text style={styles.sectionTitle}>Pilih Kategori Latihan</Text>
        <View style={styles.categoriesRow}>
          {CATEGORIES.map((cat) => (
            <Card key={cat.id} style={styles.categoryCard}>
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={styles.categoryName}>{cat.name}</Text>
              <Text style={styles.categoryCount}>{cat.count}</Text>
            </Card>
          ))}
        </View>

        {/* Featured Outdoor Run Card */}
        <Card style={styles.featuredCard}>
          <View style={styles.featuredTop}>
            <Badge label="REKOMENDASI COACH" variant="green" />
            <Text style={styles.featuredTag}>Outdoor GPS</Text>
          </View>
          <Text style={styles.featuredTitle}>Lari Santai Terbimbing 3,5 km</Text>
          <Text style={styles.featuredDesc}>
            Membakar lemak optimal pada detak jantung zona 2 (aerobik). Dilengkapi panduan audio
            dan perekaman rute presisi tinggi.
          </Text>
          <Button
            testID="btn_mulai_lari_card"
            title="Mulai Sesi Lari Sekarang"
            onPress={() => navigation.navigate('ActiveTracker')}
            style={styles.featuredBtn}
          />
        </Card>

        {/* Workout History Section */}
        <Text style={styles.sectionTitle}>Riwayat Latihan Terakhir</Text>
        {workouts.map((w) => (
          <Card key={w.id} style={styles.historyCard}>
            <View style={styles.historyLeft}>
              <View style={styles.historyIconBox}>
                <Text style={styles.historyIcon}>
                  {w.workoutType === 'running' ? '👟' : '🔥'}
                </Text>
              </View>
              <View>
                <Text style={styles.historyTitle}>{w.title}</Text>
                <Text style={styles.historyMeta}>
                  {formatDurationIndo(w.durationSeconds)} • {w.caloriesBurned} kkal
                </Text>
              </View>
            </View>
            {w.distanceKm > 0 && (
              <View style={styles.historyRight}>
                <Text style={styles.historyDistance}>{formatNumberId(w.distanceKm, 2)} km</Text>
                <Text style={styles.historyPace}>{w.avgPace}</Text>
              </View>
            )}
          </Card>
        ))}
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
  targetCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
  },
  targetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  targetSub: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textInfo,
  },
  targetMain: {
    fontSize: 28,
    fontWeight: fontWeight.black,
    color: colors.slate,
    marginTop: 2,
  },
  targetUnit: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.normal,
  },
  targetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  footerNote: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  footerTime: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
    color: colors.slateLight,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.slate,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  categoriesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  categoryIcon: {
    fontSize: 26,
    marginBottom: spacing.xs,
  },
  categoryName: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.slate,
  },
  categoryCount: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  featuredCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
  },
  featuredTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  featuredTag: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
    color: colors.info,
  },
  featuredTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.slate,
    marginTop: spacing.xxs,
  },
  featuredDesc: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
    marginVertical: spacing.sm,
  },
  featuredBtn: {
    marginTop: spacing.xs,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    marginVertical: spacing.xxs,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  historyIconBox: {
    backgroundColor: colors.borderLight,
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyIcon: {
    fontSize: 18,
  },
  historyTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.slate,
  },
  historyMeta: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyDistance: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.info,
  },
  historyPace: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});
