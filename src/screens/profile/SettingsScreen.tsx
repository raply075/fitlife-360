import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Header, Card, Button, Badge } from '../../components';
import { useAuthStore } from '../../store';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme';

type SettingsScreenNavProp = NativeStackNavigationProp<ProfileStackParamList, 'Settings'>;

interface Props {
  navigation: SettingsScreenNavProp;
}

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { logout, isLoading } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Keluar',
      'Apakah Anda yakin ingin keluar dari akun Bloom360?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Pengaturan Aplikasi"
        subtitle="Preferensi akun & sistem"
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Badge label="LAYAR 10 - PENGATURAN" variant="teal" />
        <Text style={styles.title}>Preferensi Sistem</Text>

        {/* Setting Section: Preferensi */}
        <Card style={styles.card}>
          <TouchableOpacity
            testID="btn_ke_notifikasi"
            onPress={() => navigation.navigate('NotificationSettings')}
            style={styles.settingItem}
          >
            <View>
              <Text style={styles.settingTitle}>🔔 Notifikasi & Pengingat</Text>
              <Text style={styles.settingSubtitle}>Atur jadwal alarm lari pagi & makan</Text>
            </View>
            <Text style={styles.arrowIcon}>➔</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>🌐 Bahasa Aplikasi</Text>
              <Text style={styles.settingSubtitle}>Bahasa Indonesia (Bawaan)</Text>
            </View>
            <Badge label="ID" variant="green" />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>📏 Satuan Pengukuran</Text>
              <Text style={styles.settingSubtitle}>Metrik (Kilometer, Kilogram, kkal)</Text>
            </View>
            <Badge label="METRIK" variant="blue" />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>🌓 Tema Tampilan</Text>
              <Text style={styles.settingSubtitle}>Mode Terang (Light Theme)</Text>
            </View>
            <Badge label="TERANG" variant="amber" />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingTitle}>📍 Izin Sensor GPS & Privasi</Text>
              <Text style={styles.settingSubtitle}>Presisi tinggi hanya saat aktif berlari</Text>
            </View>
            <Badge label="AKTIF" variant="green" />
          </View>
        </Card>

        {/* Version Info */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Bloom360 (FitLife 360) v1.0.0-MVP</Text>
          <Text style={styles.infoDesc}>
            Dibuat untuk kebutuhan tugas akademik Mobile Testing 11. Seluruh data disimpan secara
            lokal dan siap dihubungkan ke cloud Supabase.
          </Text>
        </Card>

        {/* Logout Button */}
        <Button
          testID="btn_logout"
          title="Keluar dari Akun"
          variant="danger"
          size="lg"
          onPress={handleLogout}
          loading={isLoading}
          style={styles.logoutBtn}
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
    marginBottom: spacing.md,
  },
  card: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  settingTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.slate,
  },
  settingSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.xs,
  },
  infoCard: {
    backgroundColor: colors.borderLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
    borderWidth: 0,
  },
  infoTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.slate,
    marginBottom: 4,
  },
  infoDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  logoutBtn: {
    marginBottom: spacing.xxl,
  },
});
