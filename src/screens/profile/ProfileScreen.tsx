import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Header, Card, Badge, Button } from '../../components';
import { useProfileStore, useAuthStore } from '../../store';
import { formatNumberId } from '../../utils';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme';

type ProfileScreenNavProp = NativeStackNavigationProp<ProfileStackParamList, 'ProfileMain'>;

interface Props {
  navigation: ProfileScreenNavProp;
}

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { profile, fetchProfile } = useProfileStore();
  const { user } = useAuthStore();
  const currentUserId = user?.id || 'user-sarah-putri-01';

  useEffect(() => {
    fetchProfile(currentUserId);
  }, [currentUserId, fetchProfile]);

  const currentWeight = profile?.currentWeight || 62.4;
  const targetWeight = profile?.targetWeight || 58.0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Profil Pengguna"
        subtitle="Akun & pencapaian gaya hidup sehat"
        rightAction={
          <Button
            testID="btn_ke_pengaturan"
            title="⚙️ Pengaturan"
            size="sm"
            variant="outline"
            onPress={() => navigation.navigate('Settings')}
          />
        }
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* User Profile Card */}
        <Card style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>SP</Text>
          </View>
          <Text style={styles.userName}>Sarah Putri</Text>
          <Text style={styles.userEmail}>sarah@email.com</Text>

          <View style={styles.badgeRow}>
            <Badge label="PELARI KONSISTEN 50+ KM/BLN" variant="green" />
          </View>
        </Card>

        {/* Current Weight & Target Card */}
        <Card variant="hijau" style={styles.weightCard}>
          <View style={styles.weightRow}>
            <View>
              <Text style={styles.weightLabel}>Status Berat Badan Saat Ini</Text>
              <Text style={styles.weightVal}>
                {formatNumberId(currentWeight)} <Text style={styles.weightUnit}>kg</Text>
              </Text>
            </View>
            <View style={styles.weightDivider} />
            <View>
              <Text style={styles.weightLabel}>Target Akhir</Text>
              <Text style={styles.weightValTarget}>
                {formatNumberId(targetWeight)} <Text style={styles.weightUnit}>kg</Text>
              </Text>
            </View>
          </View>
          <Text style={styles.weightNote}>Perlu defisit 4,4 kg lagi untuk mencapai berat ideal.</Text>
        </Card>

        {/* Quick Menu Options */}
        <Text style={styles.sectionTitle}>Menu Kebugaran & Akun</Text>

        <TouchableOpacity
          testID="btn_ke_target_kebugaran"
          onPress={() => navigation.navigate('FitnessTarget')}
          activeOpacity={0.7}
        >
          <Card style={styles.menuCard}>
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>🎯</Text>
              <View>
                <Text style={styles.menuTitle}>Kustomisasi Target Kebugaran</Text>
                <Text style={styles.menuSub}>Ubah target BB, jarak lari, dan kalori harian</Text>
              </View>
            </View>
            <Text style={styles.menuArrow}>➔</Text>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          testID="btn_ke_pengaturan_menu"
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.7}
        >
          <Card style={styles.menuCard}>
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>⚙️</Text>
              <View>
                <Text style={styles.menuTitle}>Pengaturan Sistem & Privasi</Text>
                <Text style={styles.menuSub}>Notifikasi alarm, bahasa, izin GPS, dan logout</Text>
              </View>
            </View>
            <Text style={styles.menuArrow}>➔</Text>
          </Card>
        </TouchableOpacity>

        {/* Team Identity Box */}
        <Card style={styles.teamCard}>
          <Text style={styles.teamHeader}>Kelompok 9 – NexusDev (Mobile Testing 11)</Text>
          <Text style={styles.teamMember}>• Rafli (Product Manager & QA Lead)</Text>
          <Text style={styles.teamMember}>• Dyah Purwaningsih (UI/UX Designer & BA)</Text>
          <Text style={styles.teamMember}>• Abdul Fuad Nurdiansah (Lead Developer)</Text>
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
  content: {
    padding: spacing.lg,
  },
  userCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarInitials: {
    color: colors.white,
    fontSize: 26,
    fontWeight: fontWeight.black,
  },
  userName: {
    fontSize: 22,
    fontWeight: fontWeight.black,
    color: colors.slate,
  },
  userEmail: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgeRow: {
    marginTop: spacing.md,
  },
  weightCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
  },
  weightRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  weightLabel: {
    fontSize: 11,
    color: colors.forest,
    fontWeight: fontWeight.bold,
  },
  weightVal: {
    fontSize: 26,
    fontWeight: fontWeight.black,
    color: colors.slate,
    marginTop: 2,
  },
  weightValTarget: {
    fontSize: 26,
    fontWeight: fontWeight.black,
    color: colors.forest,
    marginTop: 2,
  },
  weightUnit: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.normal,
  },
  weightDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.primaryLight,
  },
  weightNote: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.slate,
    marginBottom: spacing.sm,
  },
  menuCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    marginVertical: spacing.xs,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  menuIcon: {
    fontSize: 22,
  },
  menuTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.slate,
  },
  menuSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
  teamCard: {
    backgroundColor: colors.borderLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
    borderWidth: 0,
  },
  teamHeader: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.slate,
    marginBottom: spacing.xs,
  },
  teamMember: {
    fontSize: 11,
    color: colors.textSecondary,
    marginVertical: 1,
  },
});
