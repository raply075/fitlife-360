import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button, Input, Card, Badge, Header } from '../../components';
import { useAuthStore } from '../../store';
import { validateEmail } from '../../utils';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
}

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('sarah@email.com');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const { resetPassword, isLoading } = useAuthStore();

  const handleReset = async () => {
    setEmailError(undefined);
    setInfoMessage(null);

    const emailVal = validateEmail(email);
    if (!emailVal.valid) {
      setEmailError(emailVal.message);
      return;
    }

    const res = await resetPassword(email);
    if (res.success) {
      setInfoMessage(res.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Pemulihan Kata Sandi"
        subtitle="Atur ulang kata sandi akun Anda"
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Badge label="LAYAR 15 - LUPA SANDI" variant="purple" />
          <Text style={styles.title}>Lupa Kata Sandi?</Text>
          <Text style={styles.desc}>
            Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan serta token pemulihan
            yang berlaku selama 60 menit.
          </Text>

          <Card style={styles.card}>
            {infoMessage ? (
              <View style={styles.successAlert}>
                <Text style={styles.successTitle}>✅ Tautan Terkirim!</Text>
                <Text style={styles.successText}>{infoMessage}</Text>
              </View>
            ) : null}

            <Input
              testID="input_email_reset"
              label="Alamat Email Terdaftar"
              placeholder="sarah@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError(undefined);
                if (infoMessage) setInfoMessage(null);
              }}
              error={emailError}
            />

            <Button
              testID="btn_kirim_reset"
              title="Kirim Tautan Pemulihan"
              onPress={handleReset}
              loading={isLoading}
              size="lg"
              style={styles.btnReset}
            />
          </Card>

          <Button
            testID="btn_kembali_login"
            title="← Kembali ke Halaman Masuk"
            variant="outline"
            size="md"
            onPress={() => navigation.navigate('Login')}
            style={styles.btnBack}
          />
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
  scrollContent: {
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
  },
  successAlert: {
    backgroundColor: colors.cardHijau,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.forest,
    marginBottom: spacing.xxs,
  },
  successText: {
    fontSize: fontSize.xs,
    color: colors.forest,
    lineHeight: 18,
  },
  btnReset: {
    marginTop: spacing.xs,
  },
  btnBack: {
    marginTop: spacing.xl,
  },
});
