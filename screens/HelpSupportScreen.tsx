// screens/HelpSupportScreen.tsx
// Help & Support Screen - Dark Brown Visual Style

import { useLanguage } from '@/contexts/LanguageContext';
import { Icon, Input, Text } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface HelpSupportScreenProps {
  readonly onClose: () => void;
}

interface FaqItem {
  id: string;
  question: { en: string; ar: string };
  answer: { en: string; ar: string };
}

interface FaqRowProps {
  readonly faq: FaqItem;
  readonly isExpanded: boolean;
  readonly isLast: boolean;
  readonly language: string;
  readonly isRTL: boolean;
  readonly onToggle: (id: string) => void;
}

const FAQ_DATA: FaqItem[] = [
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

// Extracted outside parent to avoid S6478 (component definition inside parent)
function FaqRow({ faq, isExpanded, isLast, language, isRTL, onToggle }: FaqRowProps) {
  return (
    <View style={[styles.faqRow, !isLast && styles.faqRowBorder]}>
      <TouchableOpacity onPress={() => onToggle(faq.id)} activeOpacity={0.75}>
        <View style={[styles.faqHeader, isRTL && styles.faqHeaderRTL]}>
          <Text style={[styles.questionText, isRTL && styles.textRTL]}>
            {language === 'ar' ? faq.question.ar : faq.question.en}
          </Text>
          <Icon
            name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
            style={styles.chevronIcon}
            fill="rgba(250,248,245,0.5)"
          />
        </View>
      </TouchableOpacity>
      {isExpanded && (
        <Text style={[styles.answerText, isRTL && styles.textRTL]}>
          {language === 'ar' ? faq.answer.ar : faq.answer.en}
        </Text>
      )}
    </View>
  );
}

export default function HelpSupportScreen({ onClose }: Readonly<HelpSupportScreenProps>) {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const isRTL = language === 'ar';

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
    void Linking.openURL(`mailto:${email}?subject=${subject}`);
  };

  const handleWhatsAppSupport = () => {
    const phoneNumber = '+966500000000'; // Replace with actual number
    void Linking.openURL(`whatsapp://send?phone=${phoneNumber}`);
  };

  const handleCallSupport = () => {
    Alert.alert(
      t('help.contactUs') || 'Contact Us',
      t('help.phoneNumber') || 'Phone: +966 50 000 0000',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.call') || 'Call', onPress: () => { void Linking.openURL('tel:+966500000000'); } },
      ]
    );
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
          {t('profile.helpSupport')}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search bar */}
        <View style={[styles.searchContainer, isRTL && styles.searchContainerRTL]}>
          <Icon name="search-outline" style={styles.searchIcon} fill="#FAF8F5" />
          <Input
            placeholder={t('help.searchFAQ') || 'Search frequently asked questions...'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            textStyle={[styles.inputText, isRTL && styles.textRTL]}
            placeholderTextColor="rgba(250,248,245,0.5)"
          />
        </View>

        {/* FAQ section label */}
        <Text style={[styles.sectionLabel, isRTL && styles.textRTL]}>
          {t('help.faq') || 'Frequently Asked Questions'}
        </Text>

        {/* FAQ rows inside a glass panel */}
        <View style={styles.panel}>
          {filteredFAQs.map((faq, index) => (
            <FaqRow
              key={faq.id}
              faq={faq}
              isExpanded={expandedId === faq.id}
              isLast={index === filteredFAQs.length - 1}
              language={language}
              isRTL={isRTL}
              onToggle={toggleExpanded}
            />
          ))}
        </View>

        {/* Contact section label */}
        <Text style={[styles.sectionLabel, isRTL && styles.textRTL]}>
          {t('help.contactUs') || 'Contact Us'}
        </Text>

        {/* Email */}
        <TouchableOpacity onPress={handleContactSupport} activeOpacity={0.75}>
          <View style={[styles.contactRow, isRTL && styles.contactRowRTL]}>
            <View style={[styles.contactLeft, isRTL && styles.contactLeftRTL]}>
              <View style={styles.iconBox}>
                <Icon name="email-outline" style={styles.contactIcon} fill="#FAF8F5" />
              </View>
              <View style={styles.contactTextGroup}>
                <Text style={[styles.contactTitle, isRTL && styles.textRTL]}>
                  {t('help.emailSupport') || 'Email Support'}
                </Text>
                <Text style={[styles.contactSubtitle, isRTL && styles.textRTL]}>
                  support@motivateapp.com
                </Text>
              </View>
            </View>
            <Icon name="chevron-right-outline" style={styles.chevronIcon} fill="rgba(250,248,245,0.5)" />
          </View>
        </TouchableOpacity>

        {/* WhatsApp */}
        <TouchableOpacity onPress={handleWhatsAppSupport} activeOpacity={0.75}>
          <View style={[styles.contactRow, isRTL && styles.contactRowRTL]}>
            <View style={[styles.contactLeft, isRTL && styles.contactLeftRTL]}>
              <View style={styles.iconBox}>
                <Icon name="message-circle-outline" style={styles.contactIcon} fill="#FAF8F5" />
              </View>
              <View style={styles.contactTextGroup}>
                <Text style={[styles.contactTitle, isRTL && styles.textRTL]}>
                  {t('help.whatsappSupport') || 'WhatsApp Support'}
                </Text>
                <Text style={[styles.contactSubtitle, isRTL && styles.textRTL]}>
                  +966 50 000 0000
                </Text>
              </View>
            </View>
            <Icon name="chevron-right-outline" style={styles.chevronIcon} fill="rgba(250,248,245,0.5)" />
          </View>
        </TouchableOpacity>

        {/* Phone */}
        <TouchableOpacity onPress={handleCallSupport} activeOpacity={0.75}>
          <View style={[styles.contactRow, isRTL && styles.contactRowRTL]}>
            <View style={[styles.contactLeft, isRTL && styles.contactLeftRTL]}>
              <View style={styles.iconBox}>
                <Icon name="phone-outline" style={styles.contactIcon} fill="#FAF8F5" />
              </View>
              <View style={styles.contactTextGroup}>
                <Text style={[styles.contactTitle, isRTL && styles.textRTL]}>
                  {t('help.phoneSupport') || 'Phone Support'}
                </Text>
                <Text style={[styles.contactSubtitle, isRTL && styles.textRTL]}>
                  {t('help.callUs') || 'Call us anytime'}
                </Text>
              </View>
            </View>
            <Icon name="chevron-right-outline" style={styles.chevronIcon} fill="rgba(250,248,245,0.5)" />
          </View>
        </TouchableOpacity>
      </ScrollView>
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
    paddingBottom: 100,
  },
  // ── Search bar ───────────────────────────────────────────
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250,248,245,0.1)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(232,206,128,0.3)',
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 28,
  },
  searchContainerRTL: {
    flexDirection: 'row-reverse',
  },
  searchIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  searchInput: {
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
  // ── Section label ────────────────────────────────────────
  sectionLabel: {
    color: '#E8CE80',
    fontFamily: 'IBMPlexSansArabic-SemiBold',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 4,
  },
  // ── FAQ glass panel ──────────────────────────────────────
  panel: {
    backgroundColor: 'rgba(49,30,19,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(250,248,245,0.18)',
    borderRadius: 16,
    marginBottom: 28,
    overflow: 'hidden',
  },
  faqRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(49,30,19,0.5)',
  },
  faqRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(250,248,245,0.08)',
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
  questionText: {
    flex: 1,
    color: '#FAF8F5',
    fontFamily: 'IBMPlexSansArabic-SemiBold',
    fontSize: 14,
    lineHeight: 20,
  },
  chevronIcon: {
    width: 20,
    height: 20,
  },
  answerText: {
    color: 'rgba(250,248,245,0.6)',
    fontFamily: 'IBMPlexSansArabic-Regular',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(250,248,245,0.08)',
  },
  // ── Contact rows ─────────────────────────────────────────
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(49,30,19,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(250,248,245,0.18)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  contactRowRTL: {
    flexDirection: 'row-reverse',
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  contactLeftRTL: {
    flexDirection: 'row-reverse',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(250,248,245,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactIcon: {
    width: 18,
    height: 18,
  },
  contactTextGroup: {
    flex: 1,
  },
  contactTitle: {
    color: '#FAF8F5',
    fontFamily: 'IBMPlexSansArabic-SemiBold',
    fontSize: 14,
    marginBottom: 2,
  },
  contactSubtitle: {
    color: 'rgba(250,248,245,0.6)',
    fontFamily: 'IBMPlexSansArabic-Regular',
    fontSize: 12,
  },
  // ── RTL helpers ──────────────────────────────────────────
  textRTL: {
    textAlign: 'right',
  },
});
