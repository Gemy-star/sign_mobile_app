// screens/MessageCustomizationScreen.tsx
// Screen for customizing message tone, frequency, and schedule

import { useLanguage } from '@/contexts/LanguageContext';
import { useAppStyles } from '@/hooks/useAppStyles';
import { MessageFrequency, MessageTone } from '@/types/motivation';
import {
    Calendar,
    CheckCircle,
    Clock,
    Heart,
    Laugh,
    Smile,
    Sparkles,
    Target,
    Zap
} from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function MessageCustomizationScreen() {
  const { styles, colors, palette, spacing } = useAppStyles();
  const { t } = useLanguage();

  const [selectedTone, setSelectedTone] = useState<MessageTone>('encouraging');
  const [selectedFrequency, setSelectedFrequency] = useState<MessageFrequency>('daily');
  const [enableNotifications, setEnableNotifications] = useState(true);

  const tones: Array<{ id: MessageTone; icon: any; color: string }> = [
    { id: 'encouraging', icon: Smile, color: palette.success },
    { id: 'energetic', icon: Zap, color: palette.warning },
    { id: 'calm', icon: Heart, color: palette.info },
    { id: 'direct', icon: Target, color: palette.primary },
    { id: 'inspirational', icon: Sparkles, color: palette.secondary },
    { id: 'humorous', icon: Laugh, color: '#9a7cb6' },
  ];

  const frequencies: Array<{ id: MessageFrequency; icon: any }> = [
    { id: 'hourly', icon: Clock },
    { id: 'daily', icon: Calendar },
    { id: 'twice-daily', icon: Calendar },
    { id: 'weekly', icon: Calendar },
    { id: 'custom', icon: Clock },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.heading1}>{t('motivation.customize')}</Text>
        <Text style={[styles.bodyTextSecondary, styles.mb4]}>
          {t('motivation.customizeDesc')}
        </Text>

        {/* Message Tone Section */}
        <View style={[styles.card, styles.mb3]}>
          <Text style={[styles.heading3, styles.mb2]}>
            {t('motivation.selectTone')}
          </Text>
          <Text style={[styles.smallText, styles.mb3]}>
            Choose the style of motivation that resonates with you
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.xs }}>
            {tones.map((tone) => {
              const isSelected = selectedTone === tone.id;
              const Icon = tone.icon;

              return (
                <TouchableOpacity
                  key={tone.id}
                  style={[
                    {
                      width: '31%',
                      marginHorizontal: '1%',
                      marginBottom: spacing.md,
                      padding: spacing.md,
                      borderRadius: spacing.md,
                      borderWidth: 2,
                      borderColor: isSelected ? tone.color : colors.border,
                      backgroundColor: isSelected ? `${tone.color}10` : colors.surface,
                      alignItems: 'center',
                    },
                  ]}
                  onPress={() => setSelectedTone(tone.id)}
                >
                  <Icon
                    size={32}
                    color={isSelected ? tone.color : colors.textSecondary}
                    style={{ marginBottom: spacing.sm }}
                  />
                  <Text
                    style={[
                      styles.caption,
                      {
                        color: isSelected ? tone.color : colors.text,
                        fontWeight: isSelected ? '600' : '400',
                        textAlign: 'center',
                      },
                    ]}
                  >
                    {t(`motivation.tone${tone.id.charAt(0).toUpperCase() + tone.id.slice(1)}`)}
                  </Text>
                  {isSelected && (
                    <CheckCircle
                      size={16}
                      color={tone.color}
                      fill={tone.color}
                      style={{ position: 'absolute', top: spacing.xs, right: spacing.xs }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Frequency Section */}
        <View style={[styles.card, styles.mb3]}>
          <Text style={[styles.heading3, styles.mb2]}>
            {t('motivation.selectFrequency')}
          </Text>
          <Text style={[styles.smallText, styles.mb3]}>
            How often would you like to receive motivational messages?
          </Text>

          {frequencies.map((freq) => {
            const isSelected = selectedFrequency === freq.id;
            const Icon = freq.icon;

            return (
              <TouchableOpacity
                key={freq.id}
                style={[
                  styles.listItem,
                  {
                    borderWidth: 2,
                    borderColor: isSelected ? palette.primary : 'transparent',
                    backgroundColor: isSelected ? `${palette.primary}10` : colors.surface,
                    marginBottom: spacing.sm,
                  },
                ]}
                onPress={() => setSelectedFrequency(freq.id)}
              >
                <View
                  style={[
                    styles.avatar,
                    {
                      width: 40,
                      height: 40,
                      backgroundColor: isSelected ? palette.primary : colors.border,
                    },
                  ]}
                >
                  <Icon size={20} color={isSelected ? '#fff' : colors.textSecondary} />
                </View>
                <View style={styles.listItemContent}>
                  <Text style={[styles.listItemTitle, isSelected && { color: palette.primary }]}>
                    {t(`motivation.frequency${freq.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`)}
                  </Text>
                </View>
                {isSelected && (
                  <CheckCircle size={24} color={palette.primary} fill={palette.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Notification Settings */}
        <View style={[styles.card, styles.mb4]}>
          <Text style={[styles.heading3, styles.mb3]}>
            {t('motivation.notificationSettings')}
          </Text>

          <View style={[styles.rowBetween, styles.mb3]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bodyText}>{t('motivation.enableNotifications')}</Text>
              <Text style={styles.caption}>Receive push notifications for new messages</Text>
            </View>
            <Switch
              value={enableNotifications}
              onValueChange={setEnableNotifications}
              trackColor={{ false: colors.border, true: palette.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={[styles.rowBetween, styles.mt3]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bodyText}>{t('motivation.selectRingtone')}</Text>
              <Text style={styles.caption}>Default ringtone</Text>
            </View>
            <Text style={[styles.smallText, { color: palette.primary }]}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={[styles.button, styles.buttonPrimary, styles.mb2]}>
          <Text style={styles.buttonText}>{t('common.save')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonOutline]}>
          <Text style={[styles.buttonText, styles.buttonTextOutline]}>
            {t('common.cancel')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
