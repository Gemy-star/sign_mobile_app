// screens/TopicSelectionScreen.tsx
// Pinterest-style topic selection onboarding

import { useLanguage } from '@/contexts/LanguageContext';
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

const LOGO_IMAGE = require('@/assets/images/logo.png');

interface Topic {
  id: string;
  name: string;
  nameAr: string;
  image: any; // Can be require() or uri string
}

const TOPICS: Topic[] = [
  {
    id: 'motivation',
    name: 'Motivation',
    nameAr: 'تحفيز',
    image: LOGO_IMAGE,
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    nameAr: 'صحة ولياقة',
    image: LOGO_IMAGE,
  },
  {
    id: 'career',
    name: 'Career',
    nameAr: 'مهنة',
    image: LOGO_IMAGE,
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    nameAr: 'اليقظة الذهنية',
    image: LOGO_IMAGE,
  },
  {
    id: 'relationships',
    name: 'Relationships',
    nameAr: 'علاقات',
    image: LOGO_IMAGE,
  },
  {
    id: 'creativity',
    name: 'Creativity',
    nameAr: 'إبداع',
    image: LOGO_IMAGE,
  },
  {
    id: 'productivity',
    name: 'Productivity',
    nameAr: 'إنتاجية',
    image: LOGO_IMAGE,
  },
  {
    id: 'finance',
    name: 'Finance',
    nameAr: 'مالية',
    image: LOGO_IMAGE,
  },
  {
    id: 'spirituality',
    name: 'Spirituality',
    nameAr: 'روحانية',
    image: LOGO_IMAGE,
  },
  {
    id: 'personal-growth',
    name: 'Personal Growth',
    nameAr: 'نمو شخصي',
    image: LOGO_IMAGE,
  },
  {
    id: 'leadership',
    name: 'Leadership',
    nameAr: 'قيادة',
    image: LOGO_IMAGE,
  },
  {
    id: 'wellness',
    name: 'Wellness',
    nameAr: 'عافية',
    image: LOGO_IMAGE,
  },
  {
    id: 'success',
    name: 'Success',
    nameAr: 'نجاح',
    image: LOGO_IMAGE,
  },
  {
    id: 'confidence',
    name: 'Confidence',
    nameAr: 'ثقة',
    image: LOGO_IMAGE,
  },
  {
    id: 'happiness',
    name: 'Happiness',
    nameAr: 'سعادة',
    image: LOGO_IMAGE,
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
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            {isRTL ? 'مرحباً' : 'Welcome'}
          </Text>
          <Text style={styles.subtitle}>
            {isRTL ? 'اختر 3 مواضيع أو أكثر' : 'Pick 3 or more topics'}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !canProceed && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!canProceed}
        >
          <Text
            style={[
              styles.nextButtonText,
              !canProceed && styles.nextButtonTextDisabled,
            ]}
          >
            {isRTL ? 'التالي' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>

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
                  source={topic.image}
                  style={styles.topicImage}
                />
                <View style={styles.topicOverlay}>
                  <Text style={styles.topicText}>
                    {isRTL ? topic.nameAr : topic.name}
                  </Text>
                </View>
                {isSelected && (
                  <View style={styles.checkmarkContainer}>
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {selectedTopics.length > 0 && (
        <View style={styles.selectionIndicator}>
          <Text style={styles.selectionText}>
            {selectedTopics.length} {isRTL ? 'موضوع محدد' : 'selected'}
          </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter',
    fontWeight: '700',
    color: '#311E13',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: '#53321D',
  },
  nextButton: {
    backgroundColor: '#C96F4A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    minWidth: 80,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#D5CCC3',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#FAF8F5',
  },
  nextButtonTextDisabled: {
    color: '#936036',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.3,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  topicCardSelected: {
    borderWidth: 3,
    borderColor: '#C96F4A',
  },
  topicImage: {
    width: '100%',
    height: '100%',
  },
  topicOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(49, 30, 19, 0.6)',
    padding: 12,
  },
  topicText: {
    fontSize: 13,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#FAF8F5',
    textAlign: 'center',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#C96F4A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 16,
    color: '#FAF8F5',
    fontWeight: '700',
  },
  selectionIndicator: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  selectionText: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#53321D',
    backgroundColor: '#FAF8F5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#311E13',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
