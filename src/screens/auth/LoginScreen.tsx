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
import { Button, Input, Card, Badge } from '../../components';
import { useAuthStore } from '../../store';
import { validateEmail, validatePassword } from '../../utils';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('sarah@email.com');
  const [password, setPassword] = useState('Sarah123!');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  const { login, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    clearError();
    setEmailError(undefined);
    setPasswordError(undefined);

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setEmailError(emailValidation.message);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.message);
      return;
    }

    const success = await login(email, password);
    // Jika berhasil, RootNavigator akan otomatis mengarahkan ke Main (karena isAuthenticated: true)
    if (!success) {
      // Error akan ditampilkan via authStore error
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Badge label="LAYAR 02 - LOGIN" variant="purple" />
            <Text style={styles.title}>Selamat Datang!</Text>
            <Text style={styles.subtitle}>Masuk untuk melanjutkan pemantauan kebugaran Anda</Text>
          </View>

          <Card style={styles.formCard}>
            {error ? (
              <View style={styles.errorAlert}>
                <Text style={styles.errorAlertText}>⚠️ {error}</Text>
              </View>
            ) : null}

            <Input
              testID="input_email"
              label="Alamat Email"
              placeholder="sarah@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError(undefined);
                if (error) clearError();
              }}
              error={emailError}
            />

            <Input
              testID="input_password"
              label="Kata Sandi"
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError(undefined);
                if (error) clearError();
              }}
              error={passwordError}
            />

            <View style={styles.forgotRow}>
              <Button
                testID="btn_lupa_sandi"
                title="Lupa kata sandi?"
                variant="text"
                size="sm"
                onPress={() => navigation.navigate('ForgotPassword')}
              />
            </View>

            <Button
              testID="btn_masuk"
              title="Masuk"
              onPress={handleLogin}
              loading={isLoading}
              size="lg"
              style={styles.loginBtn}
            />
          </Card>

          <View style={styles.hintBox}>
            <Text style={styles.hintTitle}>Kredensial Akun Persona Sarah Putri:</Text>
            <Text style={styles.hintText}>Email: <Text style={styles.bold}>sarah@email.com</Text></Text>
            <Text style={styles.hintText}>Password: <Text style={styles.bold}>Sarah123!</Text></Text>
          </View>

          <View style={styles.registerRow}>
            <Text style={styles.registerPrompt}>Belum punya akun? </Text>
            <Button
              testID="btn_ke_daftar"
              title="Daftar Sekarang"
              variant="text"
              size="sm"
              onPress={() => navigation.navigate('Register')}
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
    justifyContent: 'center',
    flexGrow: 1,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: fontWeight.black,
    color: colors.slate,
    marginTop: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  formCard: {
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
  forgotRow: {
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  loginBtn: {
    marginTop: spacing.xs,
  },
  hintBox: {
    backgroundColor: colors.cardHijau,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: spacing.lg,
  },
  hintTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.forest,
    marginBottom: spacing.xxs,
  },
  hintText: {
    fontSize: fontSize.xs,
    color: colors.forest,
  },
  bold: {
    fontWeight: fontWeight.bold,
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  registerPrompt: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
