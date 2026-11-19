import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import * as Location from 'expo-location';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from '../../navigation/types';
import { Header, Card, Badge, Button } from '../../components';
import {
  calculateHaversineDistance,
  calculatePace,
  estimateRunningCalories,
  formatDurationStopwatch,
  formatNumberId,
} from '../../utils';
import { RouteWaypoint } from '../../types';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme';

type ActiveTrackerNavProp = NativeStackNavigationProp<WorkoutStackParamList, 'ActiveTracker'>;

interface Props {
  navigation: ActiveTrackerNavProp;
}

export const ActiveTrackerScreen: React.FC<Props> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const [seconds, setSeconds] = useState<number>(0);
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [waypoints, setWaypoints] = useState<RouteWaypoint[]>([]);
  const [currentAccuracy, setCurrentAccuracy] = useState<number>(99.4);

  const timerRef = useRef<any>(null);
  const locationSubRef = useRef<Location.LocationSubscription | null>(null);
  const lastLocationRef = useRef<Location.LocationObjectCoords | null>(null);

  // Minta izin lokasi saat layar pertama dibuka
  useEffect(() => {
    let mounted = true;
    const requestLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (mounted) {
          if (status === 'granted') {
            setHasPermission(true);
          } else {
            setHasPermission(false);
          }
        }
      } catch (err) {
        if (mounted) setHasPermission(false);
      }
    };

    requestLocation();

    return () => {
      mounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (locationSubRef.current) locationSubRef.current.remove();
    };
  }, []);

  // Timer Stopwatch Handler
  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);

        // Jika dalam Mode Simulasi: gerakkan koordinat waypoint buatan setiap detik
        if (isSimulated) {
          setDistanceKm((prevDist) => {
            // Lari rata-rata ~2.5 meter per detik (0.0025 km)
            const newDist = Number((prevDist + 0.0024).toFixed(3));
            return newDist;
          });
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused, isSimulated]);

  // GPS Tracking Real Location Listener
  const startRealLocationTracking = async () => {
    try {
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 3,
        },
        (loc) => {
          const coords = loc.coords;

          // Abaikan titik GPS berakurasi buruk (> 30 meter)
          if (coords.accuracy && coords.accuracy > 30) {
            return;
          }

          if (lastLocationRef.current) {
            const distDelta = calculateHaversineDistance(
              lastLocationRef.current.latitude,
              lastLocationRef.current.longitude,
              coords.latitude,
              coords.longitude
            );

            // Filter lompatan tidak wajar (> 25 m/s atau > 0.05 km dalam interval 2 detik)
            if (distDelta < 0.05) {
              setDistanceKm((prev) => Number((prev + distDelta).toFixed(3)));
            }
          }

          lastLocationRef.current = coords;
          if (coords.accuracy) {
            setCurrentAccuracy(Math.min(100, Math.max(90, 100 - coords.accuracy / 10)));
          }

          setWaypoints((prev) => [
            ...prev,
            {
              lat: coords.latitude,
              lng: coords.longitude,
              timestamp: loc.timestamp,
              altitude: coords.altitude ?? undefined,
              speed: coords.speed ?? undefined,
            },
          ]);
        }
      );
      locationSubRef.current = sub;
    } catch {
      // Beralih ke simulasi jika sensor gagal
      setIsSimulated(true);
    }
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    if (!isSimulated && hasPermission) {
      startRealLocationTracking();
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    if (locationSubRef.current) {
      locationSubRef.current.remove();
      locationSubRef.current = null;
    }
  };

  const handleResume = () => {
    setIsPaused(false);
    if (!isSimulated && hasPermission) {
      startRealLocationTracking();
    }
  };

  const handleFinish = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (locationSubRef.current) locationSubRef.current.remove();

    // Navigasi ke WorkoutSummary dengan membawa data hasil lari
    navigation.navigate('WorkoutSummary', {
      distanceKm: distanceKm > 0 ? distanceKm : 3.42, // Fallback ke data Sarah jika 0
      durationSeconds: seconds > 0 ? seconds : 1458,
      caloriesBurned: estimateRunningCalories(distanceKm > 0 ? distanceKm : 3.42, 62.4),
      avgPace: calculatePace(seconds > 0 ? seconds : 1458, distanceKm > 0 ? distanceKm : 3.42),
    });
  };

  const realtimePace = calculatePace(seconds, distanceKm);
  const realtimeCalories = estimateRunningCalories(distanceKm, 62.4);

  // Fallback UI jika izin lokasi ditolak
  if (hasPermission === false && !isSimulated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Pelacak GPS Live" onBack={() => navigation.goBack()} />
        <View style={styles.permissionContainer}>
          <Card style={styles.permissionCard}>
            <Text style={styles.permissionIcon}>📍</Text>
            <Text style={styles.permissionTitle}>Izin Lokasi Diperlukan</Text>
            <Text style={styles.permissionDesc}>
              Bloom360 membutuhkan izin akses lokasi latar depan (*foreground location*) untuk
              menghitung rute, jarak tempuh, dan pace lari Anda secara real-time.
            </Text>

            <Button
              testID="btn_buka_pengaturan"
              title="Buka Pengaturan Perangkat"
              onPress={() => {
                if (Platform.OS === 'ios') Linking.openURL('app-settings:');
                else Linking.openSettings();
              }}
              style={styles.permBtn}
            />

            <Button
              testID="btn_mode_simulasi"
              title="Gunakan Mode Simulasi GPS"
              variant="secondary"
              onPress={() => {
                setIsSimulated(true);
                setHasPermission(true);
              }}
              style={styles.permBtn}
            />
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Active Running Tracker"
        subtitle={isSimulated ? 'Mode Simulasi Aktif' : 'GPS Presisi Tinggi Aktif'}
        onBack={() => {
          if (isActive) {
            Alert.alert(
              'Hentikan Sesi?',
              'Aktivitas lari sedang berjalan. Apakah Anda ingin menghentikannya?',
              [
                { text: 'Lanjut Lari', style: 'cancel' },
                { text: 'Hentikan', style: 'destructive', onPress: () => navigation.goBack() },
              ]
            );
          } else {
            navigation.goBack();
          }
        }}
      />

      <View style={styles.content}>
        {/* Status Badge */}
        <View style={styles.statusRow}>
          <Badge
            label={isSimulated ? 'MODE SIMULASI GPS' : `GPS AKTIF (${currentAccuracy.toFixed(1)}%)`}
            variant={isSimulated ? 'amber' : 'green'}
          />
          <Text style={styles.liveIndicator}>
            {isActive && !isPaused ? '🔴 MEREKAM LIVE' : isPaused ? '⏸ JEDA' : 'READY'}
          </Text>
        </View>

        {/* Stopwatch HUD */}
        <View style={styles.stopwatchContainer}>
          <Text style={styles.stopwatchLabel}>DURASI WAKTU</Text>
          <Text style={styles.stopwatchText}>{formatDurationStopwatch(seconds)}</Text>
        </View>

        {/* Big Distance Display */}
        <Card variant="lari" style={styles.distanceCard}>
          <Text style={styles.distanceText}>{formatNumberId(distanceKm, 2)}</Text>
          <Text style={styles.distanceUnit}>KILOMETER (KM)</Text>
        </Card>

        {/* Secondary Metrics Row */}
        <View style={styles.metricsRow}>
          <Card style={styles.metricItem}>
            <Text style={styles.metricItemLabel}>PACE REAL-TIME</Text>
            <Text style={styles.metricItemVal}>{realtimePace}</Text>
            <Text style={styles.metricItemUnit}>/km</Text>
          </Card>
          <Card style={styles.metricItem}>
            <Text style={styles.metricItemLabel}>ESTIMASI KALORI</Text>
            <Text style={styles.metricItemVal}>{realtimeCalories}</Text>
            <Text style={styles.metricItemUnit}>kkal</Text>
          </Card>
        </View>

        {/* Action Controls */}
        <View style={styles.controlsContainer}>
          {!isActive ? (
            <Button
              testID="btn_start_run"
              title="▶ Mulai Sesi Lari"
              size="lg"
              onPress={handleStart}
              style={styles.mainActionBtn}
            />
          ) : isPaused ? (
            <View style={styles.dualControls}>
              <Button
                testID="btn_resume_run"
                title="▶ Lanjutkan"
                size="lg"
                onPress={handleResume}
                style={[styles.mainActionBtn, { flex: 1 }]}
              />
              <Button
                testID="btn_selesaikan_lari"
                title="⏹ Selesai"
                variant="danger"
                size="lg"
                onPress={handleFinish}
                style={[styles.mainActionBtn, { flex: 1 }]}
              />
            </View>
          ) : (
            <View style={styles.dualControls}>
              <Button
                testID="btn_pause_run"
                title="⏸ Jeda"
                variant="outline"
                size="lg"
                onPress={handlePause}
                style={[styles.mainActionBtn, { flex: 1 }]}
              />
              <Button
                testID="btn_selesaikan_lari"
                title="⏹ Selesai"
                variant="danger"
                size="lg"
                onPress={handleFinish}
                style={[styles.mainActionBtn, { flex: 1 }]}
              />
            </View>
          )}

          {!isSimulated && (
            <TouchableOpacity
              testID="btn_mode_simulasi"
              onPress={() => setIsSimulated(true)}
              style={styles.switchSimBtn}
            >
              <Text style={styles.switchSimText}>Beralih ke Mode Simulasi GPS</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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
    flex: 1,
    justifyContent: 'space-between',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveIndicator: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.slateLight,
  },
  stopwatchContainer: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  stopwatchLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  stopwatchText: {
    fontSize: 52,
    fontWeight: fontWeight.black,
    color: colors.slate,
    letterSpacing: 1.5,
  },
  distanceCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderRadius: borderRadius.xl,
  },
  distanceText: {
    fontSize: 64,
    fontWeight: fontWeight.black,
    color: colors.info,
  },
  distanceUnit: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textInfo,
    letterSpacing: 1.5,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  metricItemLabel: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  metricItemVal: {
    fontSize: 24,
    fontWeight: fontWeight.black,
    color: colors.slate,
  },
  metricItemUnit: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: fontWeight.medium,
  },
  controlsContainer: {
    marginTop: spacing.lg,
  },
  dualControls: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  mainActionBtn: {
    shadowColor: colors.slate,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  switchSimBtn: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  switchSimText: {
    fontSize: fontSize.xs,
    color: colors.info,
    fontWeight: fontWeight.semibold,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  permissionCard: {
    alignItems: 'center',
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
  },
  permissionIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: fontWeight.bold,
    color: colors.slate,
    marginBottom: spacing.xs,
  },
  permissionDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  permBtn: {
    width: '100%',
    marginBottom: spacing.sm,
  },
});
