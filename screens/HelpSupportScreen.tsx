// screens/HelpSupportScreen.tsx
// Help & Support Screen with UI Kitten

import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, Icon, Input, Layout, Text } from '@ui-kitten/components';
import React, { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface HelpSupportScreenProps {
  onClose: () => void;
}

const FAQ_DATA = [
  {
    id: '1',
    question: { en: 'How do I reset my password?', ar: 'كيف أقوم بإعادة تعيين كلمة المرور؟' },
    answer: { en: 'Go to Profile > Account > Change Password and follow the instructions.', ar: 'انتقل إلى الملف الشخصي > الحساب > تغيير كلمة المرور واتبع التعليمات.' },
  },
  {
    id: '2',
    question: { en: 'How do I customize my messages?', ar: 'كيف أقوم بتخصيص رسائلي؟' },
    answer: { en: 'Visit the Messages tab and select your preferred life areas and message tone.', ar: 'قم بزيارة علامة التبويب الرسائل وحدد مجالات الحياة ونبرة الرسالة المفضلة لديك.' },
  },
  {
    id: '3',
    question: { en: 'How do I track my goals?', ar: 'كيف أتتبع أهدافي؟' },
    answer: { en: 'Use the Goals tab to create, monitor, and update your progress.', ar: 'استخدم علامة التبويب الأهداف لإنشاء أهدافك ومراقبتها وتحديث تقدمك.' },
  },
  {
    id: '4',
    question: { en: 'Can I use the app offline?', ar: 'هل يمكنني استخدام التطبيق دون اتصال بالإنترنت؟' },
    answer: { en: 'Some features require internet connection. Previously loaded content remains accessible offline.', ar: 'تتطلب بعض الميزات الاتصال بالإنترنت. يظل المحتوى المحمل مسبقًا متاحًا دون اتصال بالإنترنت.' },
  },
  {
    id: '5',
    question: { en: 'How do I enable notifications?', ar: 'كيف أقوم بتمكين الإشعارات؟' },
    answer: { en: 'Go to Profile > Preferences > Notifications and toggle on.', ar: 'انتقل إلى الملف الشخصي > التفضيلات > الإشعارات وقم بالتفعيل.' },
  },
];

export default function HelpSupportScreen({ onClose }: HelpSupportScreenProps) {
  const { t, language } = useLanguage();
  const { colorScheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const isRTL = language === 'ar';
  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#000000';

  const filteredFAQs = FAQ_DATA.filter(faq => {
    const question = language === 'ar' ? faq.question.ar : faq.question.en;
    return question.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleContactSupport = () => {
    const email = 'support@motivateapp.com';
    const subject = 'Support Request';
    Linking.openURL(`mailto:${email}?subject=${subject}`);
  };

  const handleWhatsAppSupport = () => {
    const phoneNumber = '+966500000000'; // Replace with actual number
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}`);
  };

  const handleCallSupport = () => {
    Alert.alert(
      t('help.contactUs') || 'Contact Us',
      t('help.phoneNumber') || 'Phone: +966 50 000 0000',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.call') || 'Call', onPress: () => Linking.openURL('tel:+966500000000') },
      ]
    );
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
          {t('profile.helpSupport')}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Search */}
        <Input
          placeholder={t('help.searchFAQ') || 'Search frequently asked questions...'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessoryLeft={(props) => <Icon name="search-outline" {...props} />}
          style={styles.searchInput}
          textStyle={isRTL ? styles.inputTextRTL : undefined}
        />

        {/* FAQs */}
        <Text category="h6" style={[styles.sectionTitle, isRTL && styles.textRTL]}>
          {t('help.faq') || 'Frequently Asked Questions'}
        </Text>

        {filteredFAQs.map((faq) => (
          <Card key={faq.id} style={styles.faqCard}>
            <TouchableOpacity onPress={() => toggleExpanded(faq.id)}>
              <View style={[styles.faqHeader, isRTL && styles.faqHeaderRTL]}>
                <Text category="s1" style={[styles.question, { color: textColor }, isRTL && styles.textRTL]}>
                  {language === 'ar' ? faq.question.ar : faq.question.en}
                </Text>
                <Icon
                  name={expandedId === faq.id ? 'chevron-up-outline' : 'chevron-down-outline'}
                  style={styles.chevronIcon}
                  fill={textColor}
                />
              </View>
            </TouchableOpacity>
            {expandedId === faq.id && (
              <Text category="p2" appearance="hint" style={[styles.answer, isRTL && styles.textRTL]}>
                {language === 'ar' ? faq.answer.ar : faq.answer.en}
              </Text>
            )}
          </Card>
        ))}

        {/* Contact Section */}
        <Text category="h6" style={[styles.sectionTitle, isRTL && styles.textRTL]}>
          {t('help.contactUs') || 'Contact Us'}
        </Text>

        <TouchableOpacity onPress={handleContactSupport}>
          <Card style={styles.contactCard}>
            <View style={[styles.contactRow, isRTL && styles.contactRowRTL]}>
              <View style={[styles.contactLeft, isRTL && styles.contactLeftRTL]}>
                <Icon name="email-outline" style={styles.contactIcon} fill="#6366f1" />
                <View>
                  <Text category="s1" style={styles.contactText}>
                    {t('help.emailSupport') || 'Email Support'}
                  </Text>
                  <Text category="c1" appearance="hint" style={[isRTL && styles.textRTL]}>
                    support@motivateapp.com
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right-outline" style={styles.iconStyle} />
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleWhatsAppSupport}>
          <Card style={styles.contactCard}>
            <View style={[styles.contactRow, isRTL && styles.contactRowRTL]}>
              <View style={[styles.contactLeft, isRTL && styles.contactLeftRTL]}>
                <Icon name="message-circle-outline" style={styles.contactIcon} fill="#25D366" />
                <View>
                  <Text category="s1" style={styles.contactText}>
                    {t('help.whatsappSupport') || 'WhatsApp Support'}
                  </Text>
                  <Text category="c1" appearance="hint" style={[isRTL && styles.textRTL]}>
                    +966 50 000 0000
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right-outline" style={styles.iconStyle} />
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCallSupport}>
          <Card style={styles.contactCard}>
            <View style={[styles.contactRow, isRTL && styles.contactRowRTL]}>
              <View style={[styles.contactLeft, isRTL && styles.contactLeftRTL]}>
                <Icon name="phone-outline" style={styles.contactIcon} fill="#10b981" />
                <View>
                  <Text category="s1" style={styles.contactText}>
                    {t('help.phoneSupport') || 'Phone Support'}
                  </Text>
                  <Text category="c1" appearance="hint" style={[isRTL && styles.textRTL]}>
                    {t('help.callUs') || 'Call us anytime'}
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right-outline" style={styles.iconStyle} />
            </View>
          </Card>
        </TouchableOpacity>
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
    paddingBottom: 100,
  },
  searchInput: {
    marginBottom: 24,
  },
  inputTextRTL: {
    textAlign: 'right',
  },
  sectionTitle: {
    fontFamily: 'IBMPlexSansArabic-Bold',
    marginTop: 8,
    marginBottom: 12,
  },
  textRTL: {
    textAlign: 'right',
  },
  faqCard: {
    borderRadius: 12,
    marginBottom: 8,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  faqHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  question: {
    flex: 1,
    fontFamily: 'IBMPlexSansArabic-Medium',
  },
  answer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  chevronIcon: {
    width: 20,
    height: 20,
  },
  contactCard: {
    borderRadius: 12,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactRowRTL: {
    flexDirection: 'row-reverse',
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  contactLeftRTL: {
    flexDirection: 'row-reverse',
  },
  contactText: {
    fontFamily: 'IBMPlexSansArabic-Regular',
    marginBottom: 4,
  },
  contactIcon: {
    width: 24,
    height: 24,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
