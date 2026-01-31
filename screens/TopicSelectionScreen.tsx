// screens/TopicSelectionScreen.tsx
// Pinterest-style topic selection onboarding

import { useLanguage } from '@/contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 3; // 3 columns with 16px margins

// Using placeholder images for topics
const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400',
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400',
  'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400',
  'https://images.unsplash.com/photo-1499171832530-ed48d6e0e0d6?w=400',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
  'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=400',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
  'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400',
];

interface Topic {
  id: string;
  name: string;
  nameAr: string;
  image: string;
  gradient: string[];
}

const TOPICS: Topic[] = [
  {
    id: 'motivation',
    name: 'Motivation',
    nameAr: 'تحفيز',
    image: PLACEHOLDER_IMAGES[0],
    gradient: ['rgba(201, 111, 74, 0.7)', 'rgba(49, 30, 19, 0.9)'],
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    nameAr: 'صحة ولياقة',
    image: PLACEHOLDER_IMAGES[1],
    gradient: ['rgba(147, 96, 54, 0.7)', 'rgba(49, 30, 19, 0.9)'],
  },
  {
    id: 'career',
    name: 'Career',
    nameAr: 'مهنة',
    image: PLACEHOLDER_IMAGES[2],
    gradient: ['rgba(232, 206, 128, 0.7)', 'rgba(49, 30, 19, 0.9)'],
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    nameAr: 'اليقظة الذهنية',
    image: PLACEHOLDER_IMAGES[3],
    gradient: ['rgba(201, 111, 74, 0.7)', 'rgba(49, 30, 19, 0.9)'],
  },
  {
    id: 'relationships',
    name: 'Relationships',
    nameAr: 'علاقات',
    image: PLACEHOLDER_IMAGES[4],
    gradient: ['rgba(147, 96, 54, 0.7)', 'rgba(49, 30, 19, 0.9)'],
  },
  {
    id: 'creativity',
    name: 'Creativity',
    nameAr: 'إبداع',
    image: PLACEHOLDER_IMAGES[5],
    gradient: ['rgba(232, 206, 128, 0.7)', 'rgba(49, 30, 19, 0.9)'],
  },
  {
    id: 'productivity',
    name: 'Productivity',
    nameAr: 'إنتاجية',
    image: PLACEHOLDER_IMAGES[6],
    gradient: ['rgba(201, 111, 74, 0.7)', 'rgba(49, 30, 19, 0.9)'],
  },
  {
    id: 'finance',
    name: 'Finance',
    nameAr: 'مالية',
    image: PLACEHOLDER_IMAGES[7],
    gradient: ['rgba(147, 96, 54, 0.7)', 'rgba(49, 30, 19, 0.9)'],
  },
  {
    id: 'spirituality',
    name: 'Spirituality',
    nameAr: 'روحانية',
    image: PLACEHOLDER_IMAGES[8],
    gradient: ['rgba(232, 206, 128, 0.7)', 'rgba(49, 30, 19, 0.9)'],
  },
  {
    id: 'personal-growth',
    name: 'Personal Growth',
    nameAr: 'نمو شخصي',
    image: PLACEHOLDER_IMAGES[9],
    gradient: ['rgba(201, 111, 74, 0.7)', 'rgba(49, 30, 19, 0.9)'],
  },
  {
    id: 'leadership',
    name: 'Leadership',
    nameAr: 'قيادة',
    image: PLACEHOLDER_IMAGES[10],
    gradient: ['rgba(147, 96, 54, 0.7)', 'rgba(49, 30, 19, 0.9)'],
  },
  {
    id: 'wellness',
    name: 'Wellness',
    nameAr: 'عافية',
    image: PLACEHOLDER_IMAGES[11],
    gradient: ['rgba(232, 206, 128, 0.7)', 'rgba(49, 30, 19, 0.9)'],
  },
  {
    id: 'success',
    name: 'Success',
    nameAr: 'نجاح',
    image: PLACEHOLDER_IMAGES[12],
    gradient: ['rgba(201, 111, 74, 0.7)', 'rgba(49, 30, 19, 0.9)'],
  },
  {
    id: 'confidence',
    name: 'Confidence',
    nameAr: 'ثقة',
    image: PLACEHOLDER_IMAGES[13],
    gradient: ['rgba(147, 96, 54, 0.7)', 'rgba(49, 30, 19, 0.9)'],
  },
  {
    id: 'happiness',
    name: 'Happiness',
    nameAr: 'سعادة',
    image: PLACEHOLDER_IMAGES[14],
    gradient: ['rgba(232, 206, 128, 0.7)', 'rgba(49, 30, 19, 0.9)'],
  },
];

interface TopicSelectionScreenProps {
  onComplete?: (selectedTopics: string[]) => void;
}

export default function TopicSelectionScreen({ onComplete }: TopicSelectionScreenProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const isRTL = language === 'ar';
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // Font helpers
  const getFontFamily = (weight: 'regular' | 'bold' | 'semibold' = 'regular') => {
    if (isRTL) {
      // Cairo font for Arabic
      return weight === 'bold' ? 'Cairo-Bold' : weight === 'semibold' ? 'Cairo-SemiBold' : 'Cairo-Regular';
    } else {
      // Inter font for English
      return weight === 'bold' ? 'Inter-Bold' : weight === 'semibold' ? 'Inter-SemiBold' : 'Inter-Regular';
    }
  };

  const toggleTopic = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(selectedTopics.filter(id => id !== topicId));
    } else {
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleNext = () => {
    if (selectedTopics.length >= 3) {
      if (onComplete) {
        onComplete(selectedTopics);
      } else {
        // Navigate to the finding pins screen
        router.push('/finding-topics');
      }
    }
  };

  const canProceed = selectedTopics.length >= 3;

  return (
    <SafeAreaView style={styles.container}>
      {/* Modern Header with Gradient Background */}
      <LinearGradient
        colors={['#FAF8F5', '#F5F1ED']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { fontFamily: getFontFamily('bold') }]}>
                {isRTL ? 'مرحباً' : 'Welcome'}
              </Text>
              <Text style={styles.emojiWave}>👋</Text>
            </View>
            <Text style={[styles.subtitle, { fontFamily: getFontFamily('regular') }]}>
              {isRTL ? 'اختر 3 مواضيع أو أكثر' : 'Pick 3 or more topics'}
            </Text>
            {selectedTopics.length > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={['#C96F4A', '#936036']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      styles.progressFill,
                      { width: `${Math.min((selectedTopics.length / 3) * 100, 100)}%` }
                    ]}
                  />
                </View>
                <Text style={[styles.progressText, { fontFamily: getFontFamily('semibold') }]}>
                  {selectedTopics.length}/3
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !canProceed && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!canProceed}
          >
            <LinearGradient
              colors={canProceed ? ['#C96F4A', '#936036'] : ['#D5CCC3', '#D5CCC3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextButtonGradient}
            >
              <Text
                style={[
                  styles.nextButtonText,
                  { fontFamily: getFontFamily('bold') },
                  !canProceed && styles.nextButtonTextDisabled,
                ]}
              >
                {isRTL ? 'التالي' : 'Next'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {TOPICS.map((topic) => {
            const isSelected = selectedTopics.includes(topic.id);
            return (
              <TouchableOpacity
                key={topic.id}
                style={[
                  styles.topicCard,
                  isSelected && styles.topicCardSelected,
                ]}
                onPress={() => toggleTopic(topic.id)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: topic.image }}
                  style={styles.topicImage}
                  defaultSource={require('@/assets/images/logo.png')}
                />
                <LinearGradient
                  colors={topic.gradient}
                  style={styles.topicOverlay}
                >
                  <Text style={[styles.topicText, { fontFamily: getFontFamily('bold') }]}>
                    {isRTL ? topic.nameAr : topic.name}
                  </Text>
                </LinearGradient>
                {isSelected && (
                  <View style={styles.checkmarkContainer}>
                    <LinearGradient
                      colors={['#C96F4A', '#936036']}
                      style={styles.checkmark}
                    >
                      <Text style={styles.checkmarkText}>✓</Text>
                    </LinearGradient>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {selectedTopics.length > 0 && (
        <View style={styles.selectionIndicator}>
          <LinearGradient
            colors={['#C96F4A', '#936036']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.selectionBadge}
          >
            <Text style={[styles.selectionText, { fontFamily: getFontFamily('bold') }]}>
              {selectedTopics.length} {isRTL ? 'موضوع محدد' : 'topics selected'}
            </Text>
          </LinearGradient>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    shadowColor: '#311E13',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    color: '#311E13',
    marginRight: 8,
  },
  emojiWave: {
    fontSize: 32,
  },
  subtitle: {
    fontSize: 18,
    color: '#936036',
    marginBottom: 12,
    lineHeight: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(213, 204, 195, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#C96F4A',
    minWidth: 40,
  },
  nextButton: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#C96F4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonGradient: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    minWidth: 90,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 17,
    color: '#FAF8F5',
  },
  nextButtonTextDisabled: {
    color: '#936036',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 120,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  topicCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.4,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#311E13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  topicCardSelected: {
    borderWidth: 4,
    borderColor: '#C96F4A',
    transform: [{ scale: 0.98 }],
  },
  topicImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D5CCC3',
  },
  topicOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicText: {
    fontSize: 14,
    color: '#FAF8F5',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  checkmarkText: {
    fontSize: 18,
    color: '#FAF8F5',
    fontWeight: '800',
  },
  selectionIndicator: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  selectionBadge: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
    shadowColor: '#311E13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  selectionText: {
    fontSize: 16,
    color: '#FAF8F5',
  },
});
