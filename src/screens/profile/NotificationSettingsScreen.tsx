import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Header, Card, Button, Badge } from '../../components';
import { useReminderStore, useAuthStore } from '../../store';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme';

type NotifScreenNavProp = NativeStackNavigationProp<ProfileStackParamList, 'NotificationSettings'>;

interface Props {
  navigation: NotifScreenNavProp;
}

export const NotificationSettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { reminders, fetchReminders, toggleReminder } = useReminderStore();
  const { user } = useAuthStore();
  const currentUserId = user?.id || 'user-sarah-putri-01';

  // State lokal sakelar alarm
  const [morningRun, setMorningRun] = useState(true);
  const [lunchLog, setLunchLog] = useState(true);
  const [dinnerLog, setDinnerLog] = useState(true);
  const [goalMilestone, setGoalMilestone] = useState(true);

  useEffect(() => {
    fetchReminders(currentUserId);
  }, [currentUserId, fetchReminders]);

  const handleSave = () => {
    Alert.alert(
      'Pengaturan Tersimpan',
      'Preferensi alarm dan pengingat harian berhasil diperbarui.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Notifikasi & Pengingat"
        subtitle="Atur alarm pengingat kebiasaan sehat"
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Badge label="LAYAR 16 - PENGATURAN NOTIFIKASI" variant="teal" />
        <Text style={styles.title}>Jadwal Pengingat Harian</Text>
        <Text style={styles.desc}>
          Aktifkan notifikasi alarm agar Anda tetap konsisten berolahraga dan mencatat pola makan.
        </Text>

        <Card style={styles.card}>
          {/* Switch 1: Lari Pagi */}
          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchTitle}>Pengingat Lari Pagi (06:00 WIB)</Text>
              <Text style={styles.switchSub}>Mengingatkan sesi pemanasan dan lari outdoor</Text>
            </View>
            <Switch
              testID="switch_lari_pagi"
              value={morningRun}
              onValueChange={setMorningRun}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={morningRun ? colors.primary : colors.white}
            />
          </View>

          <View style={styles.divider} />

          {/* Switch 2: Catat Makan Siang */}
          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchTitle}>Catat Makan Siang (12:30 WIB)</Text>
              <Text style={styles.switchSub}>Mengingatkan input gramasi nutrisi siang</Text>
            </View>
            <Switch
              testID="switch_makan_siang"
              value={lunchLog}
              onValueChange={setLunchLog}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={lunchLog ? colors.primary : colors.white}
            />
          </View>

          <View style={styles.divider} />

          {/* Switch 3: Catat Makan Malam */}
          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchTitle}>Catat Makan Malam (19:30 WIB)</Text>
              <Text style={styles.switchSub}>Mengingatkan pemenuhan target kalori harian</Text>
            </View>
            <Switch
              testID="switch_makan_malam"
              value={dinnerLog}
              onValueChange={setDinnerLog}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={dinnerLog ? colors.primary : colors.white}
            />
          </View>

          <View style={styles.divider} />

          {/* Switch 4: Rekor 25 km */}
          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchTitle}>Notifikasi Rekor 25 km</Text>
              <Text style={styles.switchSub}>Pemberitahuan ketika target mingguan hampir tercapai</Text>
            </View>
            <Switch
              testID="switch_rekor_lari"
              value={goalMilestone}
              onValueChange={setGoalMilestone}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={goalMilestone ? colors.primary : colors.white}
            />
          </View>
        </Card>

        <Button
          testID="btn_simpan_pengingat"
          title="Simpan Pengaturan Pengingat"
          size="lg"
          onPress={handleSave}
          style={styles.saveBtn}
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
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  switchInfo: {
    flex: 1,
    paddingRight: spacing.md,
  },
  switchTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.slate,
  },
  switchSub: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.xs,
  },
  saveBtn: {
    marginBottom: spacing.xxl,
  },
});
