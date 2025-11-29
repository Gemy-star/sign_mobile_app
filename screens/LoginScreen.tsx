// screens/LoginScreen.tsx
// User Authentication Screen

import { useLanguage } from '@/contexts/LanguageContext';
import { useAppStyles } from '@/hooks/useAppStyles';
import { authService } from '@/services/auth.service';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen({ onLoginSuccess }: { onLoginSuccess?: () => void }) {
  const { styles, colors, palette, spacing } = useAppStyles();
  const { t } = useLanguage();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    // Validation
    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await authService.login({
        username: username.trim(),
        password: password.trim(),
      });

      if (response.success) {
        // Login successful
        Alert.alert(
          'Success',
          'You have successfully logged in!',
          [
            {
              text: 'OK',
              onPress: () => {
                if (onLoginSuccess) {
                  onLoginSuccess();
                }
              },
            },
          ]
        );
      } else {
        setError(response.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[styles.contentContainer, styles.center]}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <LinearGradient
          colors={[palette.primary, palette.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing.xl,
          }}
        >
          <Image
            source={require('@/assets/images/loader.png')}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
          />
        </LinearGradient>

        {/* Title */}
        <Text style={[styles.heading1, { marginBottom: spacing.sm }]}>
          {t('motivation.welcome')}
        </Text>
        <Text style={[styles.bodyTextSecondary, { marginBottom: spacing.xl, textAlign: 'center' }]}>
          {t('motivation.tagline')}
        </Text>

        {/* Error Message */}
        {error && (
          <View
            style={[
              styles.card,
              {
                backgroundColor: `${palette.danger}15`,
                borderLeftWidth: 4,
                borderLeftColor: palette.danger,
                marginBottom: spacing.lg,
              },
            ]}
          >
            <Text style={{ color: palette.danger }}>{error}</Text>
          </View>
        )}

        {/* Login Form */}
        <View style={{ width: '100%', maxWidth: 400 }}>
          {/* Username Input */}
          <View style={[styles.mb3]}>
            <Text style={[styles.bodyText, styles.mb1]}>{t('auth.username')}</Text>
            <View
              style={[
                styles.input,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: spacing.md,
                },
              ]}
            >
              <Mail size={20} color={colors.textSecondary} style={{ marginRight: spacing.sm }} />
              <TextInput
                style={{ flex: 1, color: colors.text, fontSize: 16 }}
                placeholder="Enter your username"
                placeholderTextColor={colors.textSecondary}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.mb4}>
            <Text style={[styles.bodyText, styles.mb1]}>{t('auth.password')}</Text>
            <View
              style={[
                styles.input,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: spacing.md,
                },
              ]}
            >
              <Lock size={20} color={colors.textSecondary} style={{ marginRight: spacing.sm }} />
              <TextInput
                style={{ flex: 1, color: colors.text, fontSize: 16 }}
                placeholder="Enter your password"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonPrimary,
              loading && { opacity: 0.6 },
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{t('auth.login')}</Text>
            )}
          </TouchableOpacity>

          {/* Demo Login Button */}
          <TouchableOpacity
            style={[styles.button, styles.buttonOutline, styles.mt2]}
            onPress={handleDemoLogin}
            disabled={loading}
          >
            <Text style={[styles.buttonText, styles.buttonTextOutline]}>
              {t('auth.tryDemo')}
            </Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity style={[styles.center, styles.mt3]}>
            <Text style={[styles.bodyTextSecondary]}>{t('auth.forgotPassword')}</Text>
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <View style={[styles.row, styles.center, styles.mt4]}>
          <Text style={styles.bodyTextSecondary}>{t('auth.noAccount')} </Text>
          <TouchableOpacity>
            <Text style={{ color: palette.primary, fontWeight: '600' }}>{t('auth.signUp')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

