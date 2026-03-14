// screens/RegisterScreen.tsx
// User Registration Screen - matches LoginScreen design

import { useLanguage } from '@/contexts/LanguageContext';
import { dataSource } from '@/services/dataSource.service';
import { RegisterRequest } from '@/types/api';
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
    View,
} from 'react-native';

export default function RegisterScreen({ onBackToLogin }: { readonly onBackToLogin?: () => void }) {
  const { t, isRTL } = useLanguage();

  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof RegisterRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.username.trim()) e.username = t('validation.username_required') || 'Username is required';
    else if (formData.username.length < 3) e.username = t('validation.username_min_length') || 'Min 3 characters';
    else if (!/^[\w.@+-]+$/.test(formData.username)) e.username = t('validation.username_invalid') || 'Invalid characters';
    if (!formData.email.trim()) e.email = t('validation.email_required') || 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = t('validation.email_invalid') || 'Invalid email';
    if (!formData.first_name?.trim()) e.first_name = t('validation.first_name_required') || 'First name is required';
    if (!formData.last_name?.trim()) e.last_name = t('validation.last_name_required') || 'Last name is required';
    if (!formData.password) e.password = t('validation.password_required') || 'Password is required';
    else if (formData.password.length < 8) e.password = t('validation.password_min_length') || 'Min 8 characters';
    if (!confirmPassword) e.confirmPassword = t('validation.confirm_password_required') || 'Please confirm password';
    else if (confirmPassword !== formData.password) e.confirmPassword = t('validation.passwords_dont_match') || "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});
    try {
      const response = await dataSource.register(formData);
      if (response.success) {
        router.replace('/(tabs)');
      } else {
        setErrors({ general: response.error || t('errors.registration_failed') || 'Registration failed.' });
      }
    } catch {
      setErrors({ general: t('errors.registration_failed') || 'Registration failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  const Field = ({
    label,
    icon,
    value,
    onChangeText,
    placeholder,
    secure,
    toggleSecure,
    keyboardType,
    errorKey,
    autoCapitalize = 'none',
  }: {
    label: string;
    icon: string;
    value: string;
    onChangeText: (v: string) => void;
    placeholder: string;
    secure?: boolean;
    toggleSecure?: () => void;
    keyboardType?: any;
    errorKey: string;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  }) => (
    <View style={styles.inputWrapper}>
      <Text style={[styles.inputLabel, isRTL && { textAlign: 'right' }]}>{label}</Text>
      <View style={[styles.inputContainer, errors[errorKey] ? styles.inputError : null, isRTL && { flexDirection: 'row-reverse' }]}>
        <Icon name={icon} style={[styles.inputIcon, isRTL && { marginRight: 0, marginLeft: 10 }]} fill="#FAF8F5" />
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(250, 248, 245, 0.45)"
          secureTextEntry={secure}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          keyboardType={keyboardType}
          disabled={isLoading}
          style={styles.input}
          textStyle={[styles.inputText, isRTL && { textAlign: 'right' }]}
        />
        {toggleSecure && (
          <TouchableOpacity onPress={toggleSecure} style={[styles.eyeIcon, isRTL && { marginLeft: 0, marginRight: 6 }]}>
            <Icon
              name={secure ? 'eye-off-outline' : 'eye-outline'}
              style={styles.inputIcon}
              fill="#FAF8F5"
            />
          </TouchableOpacity>
        )}
      </View>
      {errors[errorKey] ? (
        <Text style={[styles.fieldError, isRTL && { marginLeft: 0, marginRight: 4, textAlign: 'right' }]}>{errors[errorKey]}</Text>
      ) : null}
    </View>
  );

  return (
    <View style={styles.backgroundContainer}>
      <View style={styles.backgroundImage} />
      <LinearGradient
        colors={['rgba(49, 30, 19, 0.85)', 'rgba(83, 50, 29, 0.9)', 'rgba(49, 30, 19, 0.85)']}
        style={styles.overlay}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.headerSection}>
            <View style={styles.logoWrapper}>
              <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.appName}>{t('auth.create_account')}</Text>
            <Text style={styles.tagline}>
              {t('auth.join_sign_sa') || 'Join AIAY for your personal development journey'}
            </Text>
          </View>

          {/* Glass card */}
          <View style={styles.glassCard}>
            <View style={styles.cardContent}>
              {/* General error */}
              {errors.general ? (
                <View style={[styles.errorContainer, isRTL && { flexDirection: 'row-reverse', borderLeftWidth: 0, borderRightWidth: 4, borderRightColor: '#EF4444' }]}>
                  <Icon name="alert-circle-outline" style={styles.errorIcon} fill="#EF4444" />
                  <Text style={[styles.errorText, isRTL && { textAlign: 'right' }]}>{errors.general}</Text>
                </View>
              ) : null}

              <Field
                label={t('auth.first_name')}
                icon="person-outline"
                value={formData.first_name ?? ''}
                onChangeText={(v) => handleInputChange('first_name', v)}
                placeholder={t('auth.first_name_placeholder')}
                errorKey="first_name"
                autoCapitalize="words"
              />
              <Field
                label={t('auth.last_name')}
                icon="person-outline"
                value={formData.last_name ?? ''}
                onChangeText={(v) => handleInputChange('last_name', v)}
                placeholder={t('auth.last_name_placeholder')}
                errorKey="last_name"
                autoCapitalize="words"
              />
              <Field
                label={t('auth.username')}
                icon="at-outline"
                value={formData.username}
                onChangeText={(v) => handleInputChange('username', v)}
                placeholder={t('auth.username_placeholder')}
                errorKey="username"
              />
              <Field
                label={t('auth.email')}
                icon="email-outline"
                value={formData.email}
                onChangeText={(v) => handleInputChange('email', v)}
                placeholder={t('auth.email_placeholder')}
                keyboardType="email-address"
                errorKey="email"
              />
              <Field
                label={t('auth.password')}
                icon="lock-outline"
                value={formData.password}
                onChangeText={(v) => handleInputChange('password', v)}
                placeholder={t('auth.password_placeholder')}
                secure={showPassword ? false : true}
                toggleSecure={() => setShowPassword(!showPassword)}
                errorKey="password"
              />
              <Field
                label={t('auth.confirm_password')}
                icon="lock-outline"
                value={confirmPassword}
                onChangeText={(v) => {
                  setConfirmPassword(v);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                placeholder={t('auth.confirm_password_placeholder')}
                secure={showConfirm ? false : true}
                toggleSecure={() => setShowConfirm(!showConfirm)}
                errorKey="confirmPassword"
              />

              {/* Register button */}
              <TouchableOpacity
                onPress={handleRegister}
                disabled={isLoading}
                style={[styles.registerButton, isLoading && styles.buttonDisabled]}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#C96F4A', '#936036', '#C96F4A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  {isLoading ? (
                    <Spinner size="small" status="control" />
                  ) : (
                    <Text style={styles.buttonText}>{t('auth.register')}</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Back to login */}
          <View style={[styles.loginContainer, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={styles.loginText}>{t('auth.already_have_account')}{' '}</Text>
            <TouchableOpacity onPress={() => { if (onBackToLogin) { onBackToLogin(); } else { router.back(); } }}>
              <Text style={styles.loginLink}>{t('auth.login')}</Text>
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

  // Header
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(250, 248, 245, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(232, 206, 128, 0.3)',
    shadowColor: '#C96F4A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  logo: {
    width: 65,
    height: 65,
  },
  appName: {
    color: '#FAF8F5',
    fontFamily: 'IBMPlexSansArabic-Bold',
    fontSize: 30,
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    color: '#E8CE80',
    fontFamily: 'IBMPlexSansArabic-Regular',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.9,
    paddingHorizontal: 20,
  },

  // Glass card
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
    padding: 24,
    backgroundColor: 'rgba(49, 30, 19, 0.3)',
  },

  // Error banner
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

  // Inputs
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#E8CE80',
    fontFamily: 'IBMPlexSansArabic-SemiBold',
    fontSize: 13,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 248, 245, 0.1)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(232, 206, 128, 0.3)',
    paddingHorizontal: 14,
    height: 52,
  },
  inputError: {
    borderColor: 'rgba(239, 68, 68, 0.7)',
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
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
    fontSize: 15,
  },
  eyeIcon: {
    padding: 6,
    marginLeft: 6,
  },
  fieldError: {
    color: '#FCA5A5',
    fontFamily: 'IBMPlexSansArabic-Regular',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },

  // Register button
  registerButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#C96F4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#FAF8F5',
    fontFamily: 'IBMPlexSansArabic-Bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },

  // Footer
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
  },
  loginText: {
    color: '#FAF8F5',
    fontFamily: 'IBMPlexSansArabic-Regular',
    fontSize: 14,
    opacity: 0.8,
  },
  loginLink: {
    color: '#E8CE80',
    fontFamily: 'IBMPlexSansArabic-Bold',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
