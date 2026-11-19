import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button, Card, Badge } from '../../components';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme';

type SplashScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Splash'>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Dynamic Island Header Mock */}
      <View style={styles.dynamicIslandContainer}>
        <View style={styles.dynamicIsland}>
          <View style={styles.flBadge}>
            <Text style={styles.flBadgeText}>FL</Text>
          </View>
          <Text style={styles.dynamicIslandText}>Bloom360 Health Coach</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Emblem Hero Card */}
        <Card variant="auth" style={styles.heroCard}>
          <Badge label="VERSI MVP AKADEMIK" variant="purple" />
          <Text style={styles.appName}>Bloom360</Text>
          <Text style={styles.appTagline}>FitLife 360 – Pendamping Kebugaran Cerdas</Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>🎯</Text>
              <Text style={styles.featureText}>Pelacakan Jarak Akurat dengan Sensor GPS</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>🥗</Text>
              <Text style={styles.featureText}>Analisis Nutrisi & Hitung Kalori Makro</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>📊</Text>
              <Text style={styles.featureText}>Laporan Tren Progres Kebugaran Mingguan</Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Button
            testID="btn_mulai"
            title="Mulai Sekarang →"
            onPress={() => navigation.navigate('Login')}
            size="lg"
            style={styles.primaryBtn}
          />
          <Button
            testID="btn_daftar_awal"
            title="Buat Akun Baru"
            variant="outline"
            onPress={() => navigation.navigate('Register')}
            size="md"
          />
        </View>
      </View>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Kelompok 9 – NexusDev | Mobile Testing 11</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'space-between',
  },
  dynamicIslandContainer: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  dynamicIsland: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.slate,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    gap: spacing.sm,
  },
  flBadge: {
    backgroundColor: colors.primary,
    width: 22,
    height: 22,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: fontWeight.black,
  },
  dynamicIslandText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  heroCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
  },
  appName: {
    fontSize: 34,
    fontWeight: fontWeight.black,
    color: colors.slate,
    marginTop: spacing.sm,
  },
  appTagline: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  featuresList: {
    gap: spacing.md,
    marginVertical: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureBullet: {
    fontSize: 18,
  },
  featureText: {
    fontSize: fontSize.sm,
    color: colors.slateLight,
    fontWeight: fontWeight.medium,
    flex: 1,
  },
  actionContainer: {
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  primaryBtn: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
  footerText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: fontWeight.medium,
  },
});
