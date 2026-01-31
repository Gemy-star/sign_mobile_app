// screens/LoginScreen.tsx
// User Authentication Screen - Modern Pinterest-Style Design

import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthActions } from '@/hooks/useAuth';
import { Icon, Input, Spinner, Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
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

export default function LoginScreen({ onLoginSuccess }: { readonly onLoginSuccess?: () => void }) {
  const { t } = useLanguage();
  const { login } = useAuthActions();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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

  return (
    <View style={styles.backgroundContainer}>
      {/* Background with overlay */}
      <View style={styles.backgroundImage} />

      {/* Dark Overlay */}
      <LinearGradient
        colors={['rgba(49, 30, 19, 0.85)', 'rgba(83, 50, 29, 0.9)', 'rgba(49, 30, 19, 0.85)']}
        style={styles.overlay}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo and Branding */}
          <View style={styles.headerSection}>
            <View style={styles.logoWrapper}>
              <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text category="h1" style={styles.appName}>
              {t('motivation.welcome')}
            </Text>
            <Text category="s1" style={styles.tagline}>
              {t('motivation.tagline')}
            </Text>
          </View>

          {/* Glass Morphism Login Card */}
          <View style={styles.glassCard}>
            <View style={styles.cardContent}>
              {/* Error Message */}
              {error && (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle-outline" style={styles.errorIcon} fill="#EF4444" />
                  <Text category="s2" style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Login Form */}
              <View style={styles.formContainer}>
                {/* Username Input */}
                <View style={styles.inputWrapper}>
                  <Text category="label" style={styles.inputLabel}>
                    {t('auth.username')}
                  </Text>
                  <View style={styles.inputContainer}>
                    <Icon name="person-outline" style={styles.inputIcon} fill="#FAF8F5" />
                    <Input
                      placeholder={t('auth.usernamePlaceholder')}
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                      autoCorrect={false}
                      disabled={loading}
                      style={styles.input}
                      textStyle={styles.inputText}
                      placeholderTextColor="rgba(250, 248, 245, 0.5)"
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputWrapper}>
                  <Text category="label" style={styles.inputLabel}>
                    {t('auth.password')}
                  </Text>
                  <View style={styles.inputContainer}>
                    <Icon name="lock-outline" style={styles.inputIcon} fill="#FAF8F5" />
                    <Input
                      placeholder={t('auth.passwordPlaceholder')}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      disabled={loading}
                      style={styles.input}
                      textStyle={styles.inputText}
                      placeholderTextColor="rgba(250, 248, 245, 0.5)"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Icon
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        style={styles.inputIcon}
                        fill="#FAF8F5"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Forgot Password */}
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text category="s2" style={styles.forgotPasswordText}>
                    {t('auth.forgotPassword')}
                  </Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={loading}
                  style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#C96F4A', '#936036', '#C96F4A']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.loginButtonGradient}
                  >
                    {loading ? (
                      <Spinner size="small" status="control" />
                    ) : (
                      <Text category="h6" style={styles.loginButtonText}>
                        {t('auth.login')}
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Demo Login Button */}
                <TouchableOpacity
                  onPress={handleDemoLogin}
                  disabled={loading}
                  style={styles.demoButton}
                  activeOpacity={0.8}
                >
                  <Text category="s1" style={styles.demoButtonText}>
                    {t('auth.tryDemo')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text category="s1" style={styles.registerText}>
              {t('auth.noAccount')}{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text category="s1" style={styles.signUpText}>
                {t('auth.signUp')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#53321D',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(250, 248, 245, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 3,
    borderColor: 'rgba(232, 206, 128, 0.3)',
    shadowColor: '#C96F4A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  logo: {
    width: 80,
    height: 80,
  },
  appName: {
    color: '#FAF8F5',
    fontFamily: 'IBMPlexSansArabic-Bold',
    fontSize: 36,
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    color: '#E8CE80',
    fontFamily: 'IBMPlexSansArabic-Regular',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  glassCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(250, 248, 245, 0.2)',
    backgroundColor: 'rgba(49, 30, 19, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  cardContent: {
    padding: 28,
    backgroundColor: 'rgba(49, 30, 19, 0.3)',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
  },
  errorIcon: {
    width: 20,
    height: 20,
  },
  errorText: {
    flex: 1,
    color: '#FCA5A5',
    fontFamily: 'IBMPlexSansArabic-Regular',
    fontSize: 13,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#E8CE80',
    fontFamily: 'IBMPlexSansArabic-SemiBold',
    fontSize: 14,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 248, 245, 0.1)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(232, 206, 128, 0.3)',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  inputText: {
    color: '#FAF8F5',
    fontFamily: 'IBMPlexSansArabic-Regular',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
    marginLeft: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#E8CE80',
    fontFamily: 'IBMPlexSansArabic-Medium',
    fontSize: 14,
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#C96F4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonGradient: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loginButtonText: {
    color: '#FAF8F5',
    fontFamily: 'IBMPlexSansArabic-Bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  demoButton: {
    borderRadius: 16,
    height: 56,
    backgroundColor: 'rgba(250, 248, 245, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(232, 206, 128, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoButtonText: {
    color: '#E8CE80',
    fontFamily: 'IBMPlexSansArabic-SemiBold',
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
  },
  registerText: {
    color: '#FAF8F5',
    fontFamily: 'IBMPlexSansArabic-Regular',
    fontSize: 15,
    opacity: 0.8,
  },
  signUpText: {
    color: '#E8CE80',
    fontFamily: 'IBMPlexSansArabic-Bold',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});
