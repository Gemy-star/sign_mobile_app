// screens/ChangePasswordScreen.tsx
// Change Password Screen with UI Kitten

import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button, Card, Icon, Input, Layout, Text } from '@ui-kitten/components';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface ChangePasswordScreenProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ChangePasswordScreen({ onClose, onSuccess }: ChangePasswordScreenProps) {
  const { t, language } = useLanguage();
  const { colorScheme } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isRTL = language === 'ar';
  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#000000';

  const renderIcon = (visible: boolean, onPress: () => void) => (
    <TouchableOpacity onPress={onPress}>
      <Icon
        name={visible ? 'eye-off-outline' : 'eye-outline'}
        style={styles.icon}
        fill={isDark ? '#FFFFFF' : '#000000'}
      />
    </TouchableOpacity>
  );

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
    <Layout style={styles.container} level="1">
      <View style={[styles.header, isRTL && styles.headerRTL]}>
        <TouchableOpacity onPress={onClose}>
          <Icon
            name={isRTL ? 'arrow-forward-outline' : 'arrow-back-outline'}
            style={styles.backIcon}
            fill={textColor}
          />
        </TouchableOpacity>
        <Text category="h5" style={[styles.title, { color: textColor }]}>
          {t('profile.changePassword')}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text category="p1" appearance="hint" style={[styles.description, isRTL && styles.textRTL]}>
            {t('changePassword.description') || 'Please enter your current password and choose a new secure password'}
          </Text>

          <Input
            label={t('changePassword.currentPassword') || 'Current Password'}
            placeholder={t('changePassword.currentPasswordPlaceholder') || 'Enter current password'}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!showCurrentPassword}
            accessoryRight={() => renderIcon(showCurrentPassword, () => setShowCurrentPassword(!showCurrentPassword))}
            style={styles.input}
            textStyle={isRTL ? styles.inputTextRTL : undefined}
          />

          <Input
            label={t('changePassword.newPassword') || 'New Password'}
            placeholder={t('changePassword.newPasswordPlaceholder') || 'Enter new password'}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNewPassword}
            accessoryRight={() => renderIcon(showNewPassword, () => setShowNewPassword(!showNewPassword))}
            style={styles.input}
            caption={t('changePassword.passwordHint') || 'At least 8 characters, 1 uppercase, 1 lowercase, 1 number'}
            textStyle={isRTL ? styles.inputTextRTL : undefined}
          />

          <Input
            label={t('changePassword.confirmPassword') || 'Confirm Password'}
            placeholder={t('changePassword.confirmPasswordPlaceholder') || 'Re-enter new password'}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            accessoryRight={() => renderIcon(showConfirmPassword, () => setShowConfirmPassword(!showConfirmPassword))}
            style={styles.input}
            textStyle={isRTL ? styles.inputTextRTL : undefined}
          />

          <View style={styles.buttonContainer}>
            <Button
              onPress={handleChangePassword}
              disabled={loading}
              style={styles.submitButton}
            >
              {loading ? t('common.loading') : t('common.save')}
            </Button>

            <Button
              onPress={onClose}
              appearance="outline"
              disabled={loading}
              style={styles.cancelButton}
            >
              {t('common.cancel')}
            </Button>
          </View>
        </Card>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  title: {
    fontFamily: 'IBMPlexSansArabic-Bold',
  },
  placeholder: {
    width: 24,
  },
  content: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
  },
  description: {
    marginBottom: 24,
    textAlign: 'center',
  },
  textRTL: {
    textAlign: 'right',
  },
  input: {
    marginBottom: 16,
  },
  inputTextRTL: {
    textAlign: 'right',
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  submitButton: {
    borderRadius: 12,
  },
  cancelButton: {
    borderRadius: 12,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
