// screens/ChangePasswordScreen.tsx
// Change Password Screen - Dark Brown Visual Style

import { useLanguage } from '@/contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, Input, Spinner, Toggle, Text } from '@ui-kitten/components';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

interface ChangePasswordScreenProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ChangePasswordScreen({ onClose, onSuccess }: ChangePasswordScreenProps) {
  const { t, language } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isRTL = language === 'ar';

  const validatePassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleChangePassword = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(
        t('common.error'),
        t('changePassword.fillAllFields') || 'Please fill all fields'
      );
      return;
    }

    if (!validatePassword(newPassword)) {
      Alert.alert(
        t('common.error'),
        t('changePassword.passwordRequirements') || 'Password must be at least 8 characters with uppercase, lowercase, and number'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        t('common.error'),
        t('changePassword.passwordMismatch') || 'Passwords do not match'
      );
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // const response = await fetch('/api/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ currentPassword, newPassword }),
      // });

      Alert.alert(
        t('common.success') || 'Success',
        t('changePassword.success') || 'Password changed successfully!',
        [{ text: 'OK', onPress: () => {
          onSuccess?.();
          onClose();
        }}]
      );
    } catch (error) {
      Alert.alert(
        t('common.error'),
        t('changePassword.error') || 'Failed to change password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      {/* Background */}
      <View style={styles.backgroundFill} />
      <LinearGradient
        colors={['rgba(49,30,19,0.85)', 'rgba(83,50,29,0.90)', 'rgba(49,30,19,0.85)']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={[styles.header, isRTL && styles.headerRTL]}>
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon
            name={isRTL ? 'arrow-forward-outline' : 'arrow-back-outline'}
            style={styles.backIcon}
            fill="#FAF8F5"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t('profile.changePassword')}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Glass panel */}
          <View style={styles.panel}>
            {/* Description */}
            <Text style={[styles.description, isRTL && styles.textRTL]}>
              {t('changePassword.description') || 'Please enter your current password and choose a new secure password'}
            </Text>

            {/* Current Password */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, isRTL && styles.textRTL]}>
                {t('changePassword.currentPassword') || 'Current Password'}
              </Text>
              <View style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
                <Icon name="lock-outline" style={styles.inputIcon} fill="#FAF8F5" />
                <Input
                  placeholder={t('changePassword.currentPasswordPlaceholder') || 'Enter current password'}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showCurrentPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  disabled={loading}
                  style={styles.input}
                  textStyle={[styles.inputText, isRTL && styles.inputTextRTL]}
                  placeholderTextColor="rgba(250,248,245,0.5)"
                />
                <TouchableOpacity
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={styles.eyeButton}
                >
                  <Icon
                    name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
                    style={styles.inputIcon}
                    fill="#FAF8F5"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, isRTL && styles.textRTL]}>
                {t('changePassword.newPassword') || 'New Password'}
              </Text>
              <View style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
                <Icon name="shield-outline" style={styles.inputIcon} fill="#FAF8F5" />
                <Input
                  placeholder={t('changePassword.newPasswordPlaceholder') || 'Enter new password'}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  disabled={loading}
                  style={styles.input}
                  textStyle={[styles.inputText, isRTL && styles.inputTextRTL]}
                  placeholderTextColor="rgba(250,248,245,0.5)"
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeButton}
                >
                  <Icon
                    name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                    style={styles.inputIcon}
                    fill="#FAF8F5"
                  />
                </TouchableOpacity>
              </View>
              <Text style={[styles.hintText, isRTL && styles.textRTL]}>
                {t('changePassword.passwordHint') || 'At least 8 characters, 1 uppercase, 1 lowercase, 1 number'}
              </Text>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, isRTL && styles.textRTL]}>
                {t('changePassword.confirmPassword') || 'Confirm Password'}
              </Text>
              <View style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
                <Icon name="checkmark-circle-outline" style={styles.inputIcon} fill="#FAF8F5" />
                <Input
                  placeholder={t('changePassword.confirmPasswordPlaceholder') || 'Re-enter new password'}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  disabled={loading}
                  style={styles.input}
                  textStyle={[styles.inputText, isRTL && styles.inputTextRTL]}
                  placeholderTextColor="rgba(250,248,245,0.5)"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Icon
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    style={styles.inputIcon}
                    fill="#FAF8F5"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              {/* Primary — gradient save button */}
              <TouchableOpacity
                onPress={handleChangePassword}
                disabled={loading}
                activeOpacity={0.8}
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
              >
                <LinearGradient
                  colors={['#C96F4A', '#936036', '#C96F4A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryButtonGradient}
                >
                  {loading ? (
                    <Spinner size="small" status="control" />
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      {t('common.save')}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Secondary — cancel button */}
              <TouchableOpacity
                onPress={onClose}
                disabled={loading}
                activeOpacity={0.8}
                style={[styles.cancelButton, loading && styles.buttonDisabled]}
              >
                <Text style={styles.cancelButtonText}>
                  {t('common.cancel')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#53321D',
  },
  backgroundFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#53321D',
  },
  flex: {
    flex: 1,
  },
  // ── Header ──────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(49,30,19,0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(250,248,245,0.1)',
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    color: '#FAF8F5',
    fontFamily: 'IBMPlexSansArabic-Bold',
    fontSize: 18,
  },
  placeholder: {
    width: 24,
  },
  // ── Scroll content ───────────────────────────────────────
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  // ── Glass panel ──────────────────────────────────────────
  panel: {
    backgroundColor: 'rgba(49,30,19,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(250,248,245,0.18)',
    borderRadius: 16,
    padding: 20,
  },
  description: {
    color: 'rgba(250,248,245,0.6)',
    fontFamily: 'IBMPlexSansArabic-Regular',
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  // ── Input rows ───────────────────────────────────────────
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#E8CE80',
    fontFamily: 'IBMPlexSansArabic-SemiBold',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250,248,245,0.1)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(232,206,128,0.3)',
    paddingHorizontal: 14,
    height: 52,
  },
  inputContainerRTL: {
    flexDirection: 'row-reverse',
  },
  inputIcon: {
    width: 22,
    height: 22,
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
  inputTextRTL: {
    textAlign: 'right',
  },
  eyeButton: {
    padding: 6,
    marginLeft: 4,
  },
  hintText: {
    color: 'rgba(250,248,245,0.6)',
    fontFamily: 'IBMPlexSansArabic-Regular',
    fontSize: 12,
    marginTop: 6,
    lineHeight: 18,
  },
  // ── Buttons ──────────────────────────────────────────────
  buttonContainer: {
    marginTop: 28,
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#C96F4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonGradient: {
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    color: '#FAF8F5',
    fontFamily: 'IBMPlexSansArabic-Bold',
    fontSize: 17,
    letterSpacing: 0.3,
  },
  cancelButton: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(250,248,245,0.3)',
    backgroundColor: 'rgba(250,248,245,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FAF8F5',
    fontFamily: 'IBMPlexSansArabic-SemiBold',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  // ── RTL helpers ──────────────────────────────────────────
  textRTL: {
    textAlign: 'right',
  },
});
