// screens/LoginScreen.tsx
// User Authentication Screen - Redesigned with UI Kitten

import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuthActions, useAuthState } from '@/hooks/useAuth';
import { Button, Card, Icon, Input, Layout, Spinner, Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

export default function LoginScreen({ onLoginSuccess }: { onLoginSuccess?: () => void }) {
  const { t, isRTL } = useLanguage();
  const { login } = useAuthActions();
  const { colorScheme } = useTheme();
  // Use Redux for auth state
  const { isLoading: reduxLoading, error: reduxError } = useAuthState();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const isDark = colorScheme === 'dark';

  const handleLogin = async () => {
    // Validation
    if (!username.trim()) {
      setError(t('auth.loginError'));
      return;
    }

    if (!password.trim()) {
      setError(t('auth.loginError'));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Add timeout wrapper
      const timeoutPromise = new Promise<boolean>((_, reject) =>
        setTimeout(() => reject(new Error('Login timeout')), 15000)
      );

      const loginPromise = login({ username: username.trim(), password: password.trim() });

      const success = await Promise.race([loginPromise, timeoutPromise]);

      if (success) {
        // Login successful - auth context will handle state update
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setError(t('auth.loginError'));
      }
    } catch (err: any) {
      if (err.message === 'Login timeout') {
        setError('Login timeout. Please try again.');
      } else {
        setError(t('auth.loginError'));
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setUsername('admin');
    setPassword('admin123456');
    setTimeout(() => handleLogin(), 100);
  };

  const renderPasswordIcon = (props: any) => (
    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
      <Icon
        {...props}
        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
        style={styles.iconStyle}
        fill="#8F9BB3"
      />
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Layout style={styles.container} level="1">
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section with Gradient */}
          <View style={styles.logoSection}>
            <LinearGradient
              colors={['#A48111', '#C69D1A', '#A48111']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoGradient}
            >
              <View style={styles.logoContainer}>
                <Image
                  source={require('@/assets/images/loader.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            </LinearGradient>

            {/* Title */}
            <Text category="h1" style={styles.title}>
              {t('motivation.welcome')}
            </Text>
            <Text category="s1" appearance="hint" style={styles.subtitle}>
              {t('motivation.tagline')}
            </Text>
          </View>

          {/* Login Card */}
          <Card style={styles.loginCard}>
            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Icon name="alert-circle-outline" style={styles.errorIcon} fill="#EF4444" />
                <Text category="s1" status="danger" style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Login Form */}
            <View style={styles.formContainer}>
            {/* Username Input */}
            <Input
              label={t('auth.username')}
              placeholder={t('auth.usernamePlaceholder')}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              disabled={loading}
              accessoryLeft={(props) => <Icon name="email-outline" style={styles.iconStyle} fill="#8F9BB3" />}
              style={styles.input}
              textStyle={styles.inputText}
            />

            {/* Password Input */}
            <Input
              label={t('auth.password')}
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              disabled={loading}
              accessoryLeft={(props) => <Icon name="lock-outline" style={styles.iconStyle} fill="#8F9BB3" />}
              accessoryRight={renderPasswordIcon}
              style={styles.input}
              textStyle={styles.inputText}
            />

            {/* Login Button */}
            <Button
              onPress={handleLogin}
              disabled={loading}
              accessoryLeft={loading ? () => <Spinner size="small" status="control" /> : undefined}
              style={styles.loginButton}
            >
              {loading ? '' : t('auth.login')}
            </Button>

            {/* Demo Login Button */}
            <Button
              onPress={handleDemoLogin}
              disabled={loading}
              appearance="outline"
              style={styles.demoButton}
            >
              {t('auth.tryDemo')}
            </Button>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text category="s1" appearance="hint">{t('auth.forgotPassword')}</Text>
            </TouchableOpacity>
          </View>
          </Card>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text category="s1" appearance="hint">{t('auth.noAccount')} </Text>
            <TouchableOpacity>
              <Text category="s1" status="primary" style={styles.signUpText}>{t('auth.signUp')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoGradient: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  title: {
    marginBottom: 8,
    fontFamily: 'IBMPlexSansArabic-Bold',
    fontSize: 32,
  },
  subtitle: {
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'IBMPlexSansArabic-Regular',
    fontSize: 16,
  },
  loginCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorIcon: {
    width: 20,
    height: 20,
  },
  errorText: {
    flex: 1,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  inputText: {
    fontFamily: 'IBMPlexSansArabic-Regular',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  loginButton: {
    marginTop: 8,
    borderRadius: 12,
    height: 48,
  },
  demoButton: {
    marginTop: 12,
    borderRadius: 12,
    height: 48,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  signUpText: {
    fontWeight: '600',
  },
});
