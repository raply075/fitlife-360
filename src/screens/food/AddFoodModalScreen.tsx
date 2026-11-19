import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FoodStackParamList } from '../../navigation/types';
import { Header, Card, Input, Button, Badge } from '../../components';
import { useFoodStore, useAuthStore } from '../../store';
import { MealType } from '../../types';
import { calculateFoodMacros, validateFoodWeight, validateRequired } from '../../utils';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme';

type AddFoodNavProp = NativeStackNavigationProp<FoodStackParamList, 'AddFoodModal'>;

interface Props {
  navigation: AddFoodNavProp;
}

const MEAL_OPTIONS: { label: string; value: MealType }[] = [
  { label: 'Sarapan', value: 'sarapan' },
  { label: 'Makan Siang', value: 'siang' },
  { label: 'Makan Malam', value: 'malam' },
  { label: 'Cemilan', value: 'cemilan' },
];

export const AddFoodModalScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedMeal, setSelectedMeal] = useState<MealType>('siang');
  const [foodName, setFoodName] = useState('Nasi Merah & Ayam Panggang');
  const [weightText, setWeightText] = useState('150');

  const [nameError, setNameError] = useState<string | undefined>();
  const [weightError, setWeightError] = useState<string | undefined>();

  const { addFood, isLoading } = useFoodStore();
  const { user } = useAuthStore();
  const currentUserId = user?.id || 'user-sarah-putri-01';

  // Real-time kalkulasi makronutrisi otomatis
  const parsedWeight = parseFloat(weightText) || 0;
  const estimatedMacros = calculateFoodMacros(foodName, parsedWeight);

  const handleSave = async () => {
    setNameError(undefined);
    setWeightError(undefined);

    const nameVal = validateRequired(foodName, 'Nama makanan');
    if (!nameVal.valid) {
      setNameError(nameVal.message);
      return;
    }

    const weightVal = validateFoodWeight(parsedWeight);
    if (!weightVal.valid) {
      setWeightError(weightVal.message);
      return;
    }

    const success = await addFood({
      userId: currentUserId,
      mealType: selectedMeal,
      foodName: foodName.trim(),
      servingWeightGrams: parsedWeight,
      calories: estimatedMacros.calories,
      proteinGrams: estimatedMacros.proteinGrams,
      carbsGrams: estimatedMacros.carbsGrams,
      fatGrams: estimatedMacros.fatGrams,
      fiberGrams: estimatedMacros.fiberGrams,
      loggedDate: new Date().toISOString().split('T')[0],
    });

    if (success) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Tambah Makanan"
        subtitle="Hitung otomatis kalori & makro nutrisi"
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Badge label="LAYAR 12 - FORM TAMBAH MAKANAN" variant="amber" />
          <Text style={styles.title}>Input Porsi Makanan</Text>

          {/* Meal Type Selector */}
          <Text style={styles.sectionLabel}>Waktu Makan:</Text>
          <View style={styles.mealPillsRow}>
            {MEAL_OPTIONS.map((opt) => {
              const isSelected = selectedMeal === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setSelectedMeal(opt.value)}
                  style={[styles.mealPill, isSelected ? styles.mealPillActive : null]}
                >
                  <Text
                    style={[
                      styles.mealPillText,
                      isSelected ? styles.mealPillTextActive : null,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Card style={styles.formCard}>
            <Input
              testID="input_nama_makanan"
              label="Nama Makanan"
              placeholder="Contoh: Nasi Merah & Ayam Panggang"
              value={foodName}
              onChangeText={(text) => {
                setFoodName(text);
                if (nameError) setNameError(undefined);
              }}
              error={nameError}
            />

            <Input
              testID="input_berat_gram"
              label="Berat Porsi (Gram)"
              placeholder="150"
              keyboardType="numeric"
              value={weightText}
              onChangeText={(text) => {
                setWeightText(text);
                if (weightError) setWeightError(undefined);
              }}
              error={weightError}
            />

            {/* Live Calculation Preview Card */}
            <View style={styles.previewContainer}>
              <Text style={styles.previewHeader}>⚡ Estimasi Otomatis Gizi:</Text>
              <View style={styles.previewRow}>
                <View style={styles.previewItem}>
                  <Text style={styles.previewValCal}>{estimatedMacros.calories}</Text>
                  <Text style={styles.previewLbl}>kkal</Text>
                </View>
                <View style={styles.previewDivider} />
                <View style={styles.previewItem}>
                  <Text style={styles.previewVal}>{estimatedMacros.carbsGrams}g</Text>
                  <Text style={styles.previewLbl}>Karbo</Text>
                </View>
                <View style={styles.previewItem}>
                  <Text style={styles.previewVal}>{estimatedMacros.proteinGrams}g</Text>
                  <Text style={styles.previewLbl}>Protein</Text>
                </View>
                <View style={styles.previewItem}>
                  <Text style={styles.previewVal}>{estimatedMacros.fatGrams}g</Text>
                  <Text style={styles.previewLbl}>Lemak</Text>
                </View>
              </View>
            </View>

            <View style={styles.btnRow}>
              <Button
                testID="btn_batal_makanan"
                title="Batal"
                variant="outline"
                onPress={() => navigation.goBack()}
                style={styles.halfBtn}
              />
              <Button
                testID="btn_simpan_makanan"
                title="Simpan ke Catatan"
                onPress={handleSave}
                loading={isLoading}
                style={styles.halfBtn}
              />
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: fontWeight.black,
    color: colors.slate,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.slate,
    marginBottom: spacing.xs,
  },
  mealPillsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  mealPill: {
    flex: 1,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  mealPillActive: {
    backgroundColor: colors.cardMakanan,
    borderColor: colors.warning,
  },
  mealPillText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  mealPillTextActive: {
    color: colors.textWarning,
    fontWeight: fontWeight.bold,
  },
  formCard: {
    padding: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
  },
  previewContainer: {
    backgroundColor: colors.cardHijau,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    marginVertical: spacing.md,
  },
  previewHeader: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.forest,
    marginBottom: spacing.xs,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  previewItem: {
    alignItems: 'center',
  },
  previewValCal: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.black,
    color: colors.forest,
  },
  previewVal: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.slate,
  },
  previewLbl: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold,
  },
  previewDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.primaryLight,
  },
  btnRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  halfBtn: {
    flex: 1,
  },
});
