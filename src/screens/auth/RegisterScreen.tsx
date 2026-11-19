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
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateRequired,
} from '../../utils';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [confirmError, setConfirmError] = useState<string | undefined>();

  const { register, isLoading, error, clearError } = useAuthStore();

  const handleRegister = async () => {
    clearError();
    setNameError(undefined);
    setEmailError(undefined);
    setPasswordError(undefined);
    setConfirmError(undefined);

    const nameVal = validateRequired(fullName, 'Nama Lengkap');
    if (!nameVal.valid) {
      setNameError(nameVal.message);
      return;
    }

    const emailVal = validateEmail(email);
    if (!emailVal.valid) {
      setEmailError(emailVal.message);
      return;
    }

    const passVal = validatePassword(password);
    if (!passVal.valid) {
      setPasswordError(passVal.message);
      return;
    }

    const confVal = validateConfirmPassword(password, confirmPassword);
    if (!confVal.valid) {
      setConfirmError(confVal.message);
      return;
    }

    await register(email, password, fullName);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Daftar Akun Baru"
        subtitle="Mulai hidup sehat bersama Bloom360"
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Badge label="LAYAR 03R - REGISTRASI" variant="purple" />
          <Text style={styles.title}>Lengkapi Data Diri</Text>

          <Card style={styles.card}>
            {error ? (
              <View style={styles.errorAlert}>
                <Text style={styles.errorAlertText}>⚠️ {error}</Text>
              </View>
            ) : null}

            <Input
              testID="input_nama"
              label="Nama Lengkap"
              placeholder="Sarah Putri"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (nameError) setNameError(undefined);
              }}
              error={nameError}
            />

            <Input
              testID="input_email_reg"
              label="Alamat Email"
              placeholder="sarah@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError(undefined);
              }}
              error={emailError}
            />

            <Input
              testID="input_password_reg"
              label="Kata Sandi (Minimal 8 Karakter)"
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError(undefined);
              }}
              error={passwordError}
            />

            <Input
              testID="input_konfirmasi_password"
              label="Konfirmasi Kata Sandi"
              placeholder="••••••••"
              secureTextEntry
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (confirmError) setConfirmError(undefined);
              }}
              error={confirmError}
            />

            <Button
              testID="btn_daftar"
              title="Daftar Sekarang"
              onPress={handleRegister}
              loading={isLoading}
              size="lg"
              style={styles.btnDaftar}
            />
          </Card>

          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Sudah punya akun? </Text>
            <Button
              testID="btn_ke_login"
              title="Masuk di sini"
              variant="text"
              size="sm"
              onPress={() => navigation.navigate('Login')}
            />
          </View>
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
    marginBottom: spacing.md,
  },
  card: {
    padding: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
  },
  errorAlert: {
    backgroundColor: colors.errorLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error,
    marginBottom: spacing.md,
  },
  errorAlertText: {
    color: colors.textError,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  btnDaftar: {
    marginTop: spacing.sm,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  loginPrompt: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
