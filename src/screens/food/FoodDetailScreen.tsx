import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { FoodStackParamList } from '../../navigation/types';
import { Header, Card, Badge, Button } from '../../components';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme';

type FoodDetailNavProp = NativeStackNavigationProp<FoodStackParamList, 'FoodDetail'>;
type FoodDetailRouteProp = RouteProp<FoodStackParamList, 'FoodDetail'>;

interface Props {
  navigation: FoodDetailNavProp;
  route: FoodDetailRouteProp;
}

export const FoodDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const foodName = route.params?.foodName || 'Oatmeal Bowl';

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Detail Makanan"
        subtitle="Rincian zat gizi & makronutrisi"
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Badge label="LAYAR 05 - DETAIL MAKANAN" variant="amber" />
        <Text style={styles.title}>{foodName}</Text>
        <Text style={styles.category}>Sarapan Sehat • Porsi Standar 100g</Text>

        {/* Hero Calories Card */}
        <Card variant="makanan" style={styles.calorieCard}>
          <Text style={styles.calorieValue}>320</Text>
          <Text style={styles.calorieUnit}>Kilokalori (kkal)</Text>
          <Text style={styles.calorieDesc}>
            Menyumbang 17,8% dari target kebutuhan harian (1.800 kkal).
          </Text>
        </Card>

        {/* Makro Breakdown */}
        <Text style={styles.sectionHeader}>Komposisi Makronutrisi</Text>
        <View style={styles.macroGrid}>
          <Card style={styles.macroCard}>
            <Text style={styles.macroLabel}>Karbohidrat</Text>
            <Text style={styles.macroValue}>45,0 g</Text>
            <Text style={styles.macroSub}>Energi Utama</Text>
          </Card>
          <Card style={styles.macroCard}>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>12,0 g</Text>
            <Text style={styles.macroSub}>Pemulihan Otot</Text>
          </Card>
          <Card style={styles.macroCard}>
            <Text style={styles.macroLabel}>Lemak Sehat</Text>
            <Text style={styles.macroValue}>8,0 g</Text>
            <Text style={styles.macroSub}>Dukungan Hormon</Text>
          </Card>
          <Card style={styles.macroCard}>
            <Text style={styles.macroLabel}>Serat Pangan</Text>
            <Text style={styles.macroValue}>6,0 g</Text>
            <Text style={styles.macroSub}>Pencernaan Halus</Text>
          </Card>
        </View>

        {/* Rekomendasi Health Coach */}
        <Card style={styles.recommendationCard}>
          <Text style={styles.recTitle}>💡 Saran Health Coach:</Text>
          <Text style={styles.recText}>
            Oatmeal kaya akan beta-glukan yang memberikan pelepasan energi stabil (*slow-release carbs*).
            Sangat direkomendasikan dikonsumsi 1 hingga 2 jam sebelum melakukan sesi lari luar ruangan
            untuk menghindari kram perut dan menjaga stamina tetap prima.
          </Text>
        </Card>

        <Button
          testID="btn_kembali_catatan"
          title="← Kembali ke Catatan Makanan"
          variant="outline"
          size="lg"
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
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
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: fontWeight.black,
    color: colors.slate,
    marginTop: spacing.xs,
  },
  category: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  calorieCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderRadius: borderRadius.xl,
  },
  calorieValue: {
    fontSize: 48,
    fontWeight: fontWeight.black,
    color: colors.warning,
  },
  calorieUnit: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textWarning,
    marginBottom: spacing.xs,
  },
  calorieDesc: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  sectionHeader: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.slate,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  macroCard: {
    width: '48%',
    padding: spacing.md,
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  macroValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.slate,
  },
  macroSub: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: fontWeight.medium,
    marginTop: 2,
  },
  recommendationCard: {
    backgroundColor: colors.cardHijau,
    borderColor: colors.primary,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  recTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.forest,
    marginBottom: spacing.xs,
  },
  recText: {
    fontSize: fontSize.xs,
    color: colors.forest,
    lineHeight: 18,
  },
  backBtn: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
});
