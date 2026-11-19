import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Header, Card, Input, Button, Badge } from '../../components';
import { useProfileStore, useAuthStore } from '../../store';
import { validateTargetWeight } from '../../utils';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme';

type FitnessTargetNavProp = NativeStackNavigationProp<ProfileStackParamList, 'FitnessTarget'>;

interface Props {
  navigation: FitnessTargetNavProp;
}

export const FitnessTargetScreen: React.FC<Props> = ({ navigation }) => {
  const { profile, updateTargets, isLoading } = useProfileStore();
  const { user } = useAuthStore();
  const currentUserId = user?.id || 'user-sarah-putri-01';

  const [targetWeight, setTargetWeight] = useState(
    profile?.targetWeight ? profile.targetWeight.toString() : '58'
  );
  const [runningKm, setRunningKm] = useState(
    profile?.weeklyRunningTargetKm ? profile.weeklyRunningTargetKm.toString() : '25'
  );
  const [workoutHours, setWorkoutHours] = useState(
    profile?.weeklyWorkoutHoursTarget ? profile.weeklyWorkoutHoursTarget.toString() : '5'
  );
  const [dailyCalories, setDailyCalories] = useState(
    profile?.dailyCalorieTarget ? profile.dailyCalorieTarget.toString() : '1800'
  );

  const [weightError, setWeightError] = useState<string | undefined>();

  const handleSave = async () => {
    setWeightError(undefined);

    const parsedWeight = parseFloat(targetWeight);
    const weightVal = validateTargetWeight(parsedWeight);
    if (!weightVal.valid) {
      setWeightError(weightVal.message);
      return;
    }

    const parsedKm = parseFloat(runningKm) || 25;
    const parsedHours = parseFloat(workoutHours) || 5;
    const parsedCalories = parseInt(dailyCalories, 10) || 1800;

    const success = await updateTargets(
      currentUserId,
      parsedWeight,
      parsedKm,
      parsedHours,
      parsedCalories
    );

    if (success) {
      Alert.alert(
        'Target Berhasil Diperbarui',
        'Target kebugaran personal Sarah Putri telah disimpan ke state aplikasi.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Target Kebugaran"
        subtitle="Kustomisasi tujuan hidup sehat Anda"
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Badge label="LAYAR 14 - KUSTOMISASI TARGET" variant="teal" />
          <Text style={styles.title}>Atur Target Personal</Text>
          <Text style={styles.desc}>
            Sesuaikan target berat badan dan aktivitas mingguan untuk menghitung rekomendasi defisit
            kalori harian yang aman.
          </Text>

          <Card style={styles.card}>
            <Input
              testID="input_target_bb"
              label="Target Berat Badan (kg)"
              placeholder="58"
              keyboardType="numeric"
              value={targetWeight}
              onChangeText={(text) => {
                setTargetWeight(text);
                if (weightError) setWeightError(undefined);
              }}
              error={weightError}
            />

            <Input
              testID="input_target_jarak"
              label="Target Lari Mingguan (km)"
              placeholder="25"
              keyboardType="numeric"
              value={runningKm}
              onChangeText={setRunningKm}
            />

            <Input
              testID="input_target_waktu"
              label="Target Waktu Latihan Mingguan (jam)"
              placeholder="5.0"
              keyboardType="numeric"
              value={workoutHours}
              onChangeText={setWorkoutHours}
            />

            <Input
              testID="input_target_kalori"
              label="Target Kalori Harian (kkal)"
              placeholder="1800"
              keyboardType="numeric"
              value={dailyCalories}
              onChangeText={setDailyCalories}
            />

            <Button
              testID="btn_simpan_target"
              title="Perbarui Target Kebugaran"
              size="lg"
              onPress={handleSave}
              loading={isLoading}
              style={styles.saveBtn}
            />
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
  },
  desc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  card: {
    padding: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
  },
  saveBtn: {
    marginTop: spacing.md,
  },
});
