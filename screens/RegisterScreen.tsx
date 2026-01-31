// screens/RegisterScreen.tsx
// User Registration Screen with Form Validation

import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { dataSource } from '@/services/dataSource.service';
import { RegisterRequest } from '@/types/api';
import { Button, Card, Icon, Input, Layout, Spinner, Text } from '@ui-kitten/components';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 600;

export default function RegisterScreen() {
  const { colors, colorScheme } = useTheme();
  const { t, language, isRTL } = useLanguage();
  const isDark = colorScheme === 'dark';

  // Form state
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmEntry, setSecureConfirmEntry] = useState(true);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ============================================================================
  // Validation
  // ============================================================================

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = t('validation.username_required') || 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = t('validation.username_min_length') || 'Username must be at least 3 characters';
    } else if (!/^[\w.@+-]+$/.test(formData.username)) {
      newErrors.username = t('validation.username_invalid') || 'Username can only contain letters, numbers, and @/./+/-/_';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t('validation.email_required') || 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.email_invalid') || 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t('validation.password_required') || 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = t('validation.password_min_length') || 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = t('validation.confirm_password_required') || 'Please confirm your password';
    } else if (confirmPassword !== formData.password) {
      newErrors.confirmPassword = t('validation.passwords_dont_match') || 'Passwords do not match';
    }

    // First name validation
    if (!formData.first_name?.trim()) {
      newErrors.first_name = t('validation.first_name_required') || 'First name is required';
    }

    // Last name validation
    if (!formData.last_name?.trim()) {
      newErrors.last_name = t('validation.last_name_required') || 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================================================
  // Form Handlers
  // ============================================================================

  const handleInputChange = (field: keyof RegisterRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await dataSource.register(formData);

      if (response.success) {
        console.log('Registration successful:', response.data);
        // Navigate to login or main app
        router.replace('/(tabs)');
      } else {
        setErrors({
          general: response.error || t('errors.registration_failed') || 'Registration failed. Please try again.',
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({
        general: t('errors.registration_failed') || 'Registration failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // UI Renderers
  // ============================================================================

  const renderIcon = (props: any, name: string) => (
    <Icon {...props} name={name} />
  );

  const renderPasswordIcon = (props: any, secure: boolean, toggle: () => void) => (
    <TouchableOpacity onPress={toggle}>
      <Icon {...props} name={secure ? 'eye-off' : 'eye'} />
    </TouchableOpacity>
  );

  const textColor = isDark ? '#F8F8F8' : '#0F0F0F';
  const cardBg = isDark ? '#2E2E2E' : '#FFFFFF';

  return (
    <Layout style={[styles.container, { backgroundColor: isDark ? '#0F0F0F' : '#F8F8F8' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                { color: textColor, textAlign: isRTL ? 'right' : 'left' },
              ]}
            >
              {t('auth.create_account') || 'Create Account'}
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: isDark ? '#B8B8B8' : '#666666', textAlign: isRTL ? 'right' : 'left' },
              ]}
            >
              {t('auth.join_sign_sa') || 'Join Sign SA for your personal development journey'}
            </Text>
          </View>

          {/* Registration Form */}
          <Card
            style={[
              styles.formCard,
              {
                backgroundColor: cardBg,
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
              },
            ]}
          >
            {/* General Error */}
            {errors.general && (
              <View style={styles.errorContainer}>
                <Icon name="alert-circle" fill="#FF3D71" style={styles.errorIcon} />
                <Text style={styles.errorText}>{errors.general}</Text>
              </View>
            )}

            {/* Username */}
            <Input
              label={t('auth.username') || 'Username'}
              placeholder={t('auth.username_placeholder') || 'Enter username'}
              value={formData.username}
              onChangeText={(value) => handleInputChange('username', value)}
              accessoryLeft={(props) => renderIcon(props, 'person-outline')}
              status={errors.username ? 'danger' : 'basic'}
              caption={errors.username}
              autoCapitalize="none"
              style={styles.input}
            />

            {/* Email */}
            <Input
              label={t('auth.email') || 'Email'}
              placeholder={t('auth.email_placeholder') || 'Enter email'}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              accessoryLeft={(props) => renderIcon(props, 'email-outline')}
              status={errors.email ? 'danger' : 'basic'}
              caption={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            {/* First Name */}
            <Input
              label={t('auth.first_name') || 'First Name'}
              placeholder={t('auth.first_name_placeholder') || 'Enter first name'}
              value={formData.first_name}
              onChangeText={(value) => handleInputChange('first_name', value)}
              accessoryLeft={(props) => renderIcon(props, 'person')}
              status={errors.first_name ? 'danger' : 'basic'}
              caption={errors.first_name}
              style={styles.input}
            />

            {/* Last Name */}
            <Input
              label={t('auth.last_name') || 'Last Name'}
              placeholder={t('auth.last_name_placeholder') || 'Enter last name'}
              value={formData.last_name}
              onChangeText={(value) => handleInputChange('last_name', value)}
              accessoryLeft={(props) => renderIcon(props, 'person')}
              status={errors.last_name ? 'danger' : 'basic'}
              caption={errors.last_name}
              style={styles.input}
            />

            {/* Password */}
            <Input
              label={t('auth.password') || 'Password'}
              placeholder={t('auth.password_placeholder') || 'Enter password'}
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              accessoryLeft={(props) => renderIcon(props, 'lock-outline')}
              accessoryRight={(props) =>
                renderPasswordIcon(props, secureTextEntry, () =>
                  setSecureTextEntry(!secureTextEntry)
                )
              }
              secureTextEntry={secureTextEntry}
              status={errors.password ? 'danger' : 'basic'}
              caption={errors.password}
              autoCapitalize="none"
              style={styles.input}
            />

            {/* Confirm Password */}
            <Input
              label={t('auth.confirm_password') || 'Confirm Password'}
              placeholder={t('auth.confirm_password_placeholder') || 'Re-enter password'}
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                if (errors.confirmPassword) {
                  setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }
              }}
              accessoryLeft={(props) => renderIcon(props, 'lock-outline')}
              accessoryRight={(props) =>
                renderPasswordIcon(props, secureConfirmEntry, () =>
                  setSecureConfirmEntry(!secureConfirmEntry)
                )
              }
              secureTextEntry={secureConfirmEntry}
              status={errors.confirmPassword ? 'danger' : 'basic'}
              caption={errors.confirmPassword}
              autoCapitalize="none"
              style={styles.input}
            />

            {/* Register Button */}
            <Button
              style={styles.registerButton}
              status="primary"
              onPress={handleRegister}
              disabled={isLoading}
              accessoryLeft={isLoading ? () => <Spinner size="small" status="control" /> : undefined}
            >
              {isLoading ? t('auth.creating_account') || 'Creating Account...' : t('auth.register') || 'Register'}
            </Button>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: isDark ? '#B8B8B8' : '#666666' }]}>
                {t('auth.already_have_account') || 'Already have an account?'}{' '}
              </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={[styles.loginLink, { color: colors.primary }]}>
                  {t('auth.login') || 'Login'}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: isTablet ? 32 : 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: isTablet ? 32 : 24,
  },
  title: {
    fontSize: isTablet ? 32 : 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: isTablet ? 16 : 14,
    lineHeight: 22,
  },
  formCard: {
    borderRadius: isTablet ? 20 : 16,
    padding: isTablet ? 28 : 20,
    marginBottom: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  errorText: {
    color: '#FF3D71',
    fontSize: 13,
    flex: 1,
  },
  input: {
    marginBottom: 16,
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
