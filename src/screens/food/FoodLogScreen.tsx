import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FoodStackParamList } from '../../navigation/types';
import { Header, Card, Button, Badge } from '../../components';
import { useFoodStore, useAuthStore, useProfileStore } from '../../store';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme';

type FoodLogNavProp = NativeStackNavigationProp<FoodStackParamList, 'FoodLog'>;

interface Props {
  navigation: FoodLogNavProp;
}

const WEEK_DAYS = [
  { day: 'Sen', date: '17 Nov' },
  { day: 'Sel', date: '18 Nov' },
  { day: 'Rab', date: '19 Nov', active: true },
  { day: 'Kam', date: '20 Nov' },
  { day: 'Jum', date: '21 Nov' },
];

export const FoodLogScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(2); // Rabu (Hari Ini)
  const { todayLogs, todaySummary, fetchTodayLogs, isLoading } = useFoodStore();
  const { user } = useAuthStore();
  const { profile } = useProfileStore();

  const currentUserId = user?.id || 'user-sarah-putri-01';
  const targetCalorie = profile?.dailyCalorieTarget || 1800;

  useEffect(() => {
    fetchTodayLogs(currentUserId);
  }, [currentUserId, fetchTodayLogs]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Catatan Makanan"
        subtitle="Pantau asupan kalori & nutrisi harian"
        rightAction={
          <Button
            testID="btn_tambah_makanan"
            title="+ Tambah"
            size="sm"
            onPress={() => navigation.navigate('AddFoodModal')}
          />
        }
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Strip Hari Sen - Jum */}
        <View style={styles.dateStrip}>
          {WEEK_DAYS.map((item, index) => {
            const isSelected = index === selectedDayIndex;
            return (
              <TouchableOpacity
                key={item.day}
                onPress={() => setSelectedDayIndex(index)}
                style={[styles.dateCard, isSelected ? styles.dateCardActive : null]}
              >
                <Text style={[styles.dayText, isSelected ? styles.dayTextActive : null]}>
                  {item.day}
                </Text>
                <Text style={[styles.dateText, isSelected ? styles.dateTextActive : null]}>
                  {item.date}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Hero Daily Summary Card */}
        <Card variant="makanan" style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={styles.summaryTitle}>Total Konsumsi Hari Ini</Text>
              <Text style={styles.calorieBig}>
                {todaySummary.totalCalories}{' '}
                <Text style={styles.calorieSmall}>/ {targetCalorie} kkal</Text>
              </Text>
            </View>
            <Badge
              label={todaySummary.totalCalories <= targetCalorie ? 'Terkendali' : 'Berlebih'}
              variant="amber"
            />
          </View>

          {/* Makro Row */}
          <View style={styles.macroPillsRow}>
            <View style={styles.macroPill}>
              <Text style={styles.macroVal}>{todaySummary.totalCarbs}g</Text>
              <Text style={styles.macroSub}>Karbo</Text>
            </View>
            <View style={styles.macroPill}>
              <Text style={styles.macroVal}>{todaySummary.totalProtein}g</Text>
              <Text style={styles.macroSub}>Protein</Text>
            </View>
            <View style={styles.macroPill}>
              <Text style={styles.macroVal}>{todaySummary.totalFat}g</Text>
              <Text style={styles.macroSub}>Lemak</Text>
            </View>
            <View style={styles.macroPill}>
              <Text style={styles.macroVal}>{todaySummary.totalFiber}g</Text>
              <Text style={styles.macroSub}>Serat</Text>
            </View>
          </View>
        </Card>

        {/* Food Logs List */}
        <View style={styles.logsSection}>
          <Text style={styles.sectionHeader}>Daftar Menu Makanan Hari Ini</Text>

          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
          ) : todayLogs.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>Belum ada makanan dicatat untuk hari ini.</Text>
            </Card>
          ) : (
            todayLogs.map((log) => {
              const isOatmeal = log.foodName.toLowerCase().includes('oatmeal');
              return (
                <TouchableOpacity
                  key={log.id}
                  testID={isOatmeal ? 'item_oatmeal_bowl' : undefined}
                  onPress={() => {
                    if (isOatmeal) {
                      navigation.navigate('FoodDetail', { foodName: log.foodName });
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Card style={styles.foodItemCard}>
                    <View style={styles.foodLeft}>
                      <View style={styles.mealBadge}>
                        <Text style={styles.mealBadgeText}>
                          {log.mealType.toUpperCase()}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.foodNameText}>{log.foodName}</Text>
                        <Text style={styles.foodMetaText}>
                          {log.servingWeightGrams}g • Karbo {log.carbsGrams}g • Protein {log.proteinGrams}g
                        </Text>
                      </View>
                    </View>
                    <View style={styles.foodRight}>
                      <Text style={styles.foodCalText}>{log.calories} kkal</Text>
                      {isOatmeal ? <Text style={styles.detailArrow}>Rincian →</Text> : null}
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })
          )}
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
  },
  dateStrip: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  dateCard: {
    flex: 1,
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  dateCardActive: {
    backgroundColor: colors.cardMakanan,
    borderColor: colors.warning,
  },
  dayText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.bold,
  },
  dayTextActive: {
    color: colors.textWarning,
  },
  dateText: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  dateTextActive: {
    color: colors.textWarning,
    fontWeight: fontWeight.bold,
  },
  summaryCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  summaryTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textWarning,
  },
  calorieBig: {
    fontSize: 28,
    fontWeight: fontWeight.black,
    color: colors.slate,
    marginTop: 2,
  },
  calorieSmall: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.normal,
  },
  macroPillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  macroPill: {
    alignItems: 'center',
    flex: 1,
  },
  macroVal: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.slate,
  },
  macroSub: {
    fontSize: 10,
    color: colors.textMuted,
  },
  logsSection: {
    marginTop: spacing.xs,
  },
  sectionHeader: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.slate,
    marginBottom: spacing.sm,
  },
  foodItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    marginVertical: spacing.xs,
  },
  foodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  mealBadge: {
    backgroundColor: colors.borderLight,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.xs,
  },
  mealBadgeText: {
    fontSize: 9,
    fontWeight: fontWeight.extrabold,
    color: colors.slateMuted,
  },
  foodNameText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.slate,
  },
  foodMetaText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  foodRight: {
    alignItems: 'flex-end',
  },
  foodCalText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.forest,
  },
  detailArrow: {
    fontSize: 11,
    color: colors.info,
    fontWeight: fontWeight.bold,
    marginTop: 2,
  },
  emptyCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});
