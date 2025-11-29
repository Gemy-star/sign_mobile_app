// screens/CategorySelectionScreen.tsx
// Screen for users to select their motivation focus areas

import { useLanguage } from '@/contexts/LanguageContext';
import { useAppStyles } from '@/hooks/useAppStyles';
import { MOTIVATION_CATEGORIES } from '@/types/motivation';
import {
    Brain,
    Briefcase,
    CheckCircle,
    DollarSign,
    Dumbbell,
    Heart,
    Palette,
    Sparkles,
    Sun
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const iconMap: { [key: string]: any } = {
  brain: Brain,
  dumbbell: Dumbbell,
  briefcase: Briefcase,
  'dollar-sign': DollarSign,
  heart: Heart,
  sparkles: Sparkles,
  palette: Palette,
  sun: Sun,
};

export default function CategorySelectionScreen() {
  const { styles, colors, palette, spacing } = useAppStyles();
  const { t } = useLanguage();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getCategoryColor = (categoryId: string) => {
    const category = MOTIVATION_CATEGORIES.find((c) => c.id === categoryId);
    return category?.color || palette.primary;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.contentContainer, { paddingBottom: 0 }]}>
        <Text style={styles.heading1}>{t('motivation.selectCategories')}</Text>
        <Text style={[styles.bodyTextSecondary, styles.mb3]}>
          {t('motivation.selectCategoriesDesc')}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {MOTIVATION_CATEGORIES.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            const IconComponent = iconMap[category.icon];
            const categoryColor = category.color;

            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.card,
                  {
                    width: cardWidth,
                    marginBottom: spacing.lg,
                    borderWidth: 2,
                    borderColor: isSelected ? categoryColor : 'transparent',
                    position: 'relative',
                  },
                ]}
                onPress={() => toggleCategory(category.id)}
                activeOpacity={0.7}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <View
                    style={{
                      position: 'absolute',
                      top: spacing.sm,
                      right: spacing.sm,
                      zIndex: 1,
                    }}
                  >
                    <CheckCircle size={24} color={categoryColor} fill={categoryColor} />
                  </View>
                )}

                {/* Category Icon */}
                <View
                  style={[
                    styles.statIcon,
                    {
                      backgroundColor: `${categoryColor}15`,
                      marginBottom: spacing.md,
                    },
                  ]}
                >
                  {IconComponent && <IconComponent size={28} color={categoryColor} />}
                </View>

                {/* Category Emoji */}
                <Text style={{ fontSize: 32, marginBottom: spacing.sm, textAlign: 'center' }}>
                  {category.emoji}
                </Text>

                {/* Category Name */}
                <Text
                  style={[
                    styles.bodyText,
                    {
                      fontWeight: '600',
                      textAlign: 'center',
                      marginBottom: spacing.xs,
                    }
                  ]}
                  numberOfLines={2}
                >
                  {t(category.nameKey)}
                </Text>

                {/* Category Description */}
                <Text
                  style={[
                    styles.caption,
                    {
                      textAlign: 'center',
                      lineHeight: 16,
                    }
                  ]}
                  numberOfLines={3}
                >
                  {t(category.descriptionKey)}
                </Text>

                {/* Subcategory Count */}
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: `${categoryColor}15`,
                      marginTop: spacing.md,
                      alignSelf: 'center',
                    },
                  ]}
                >
                  <Text style={[styles.badgeText, { color: categoryColor, fontSize: 10 }]}>
                    {category.subCategories.length} {t('motivation.categories') || 'areas'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bottom Action */}
        <View style={styles.mt4}>
          <Text style={[styles.smallText, { textAlign: 'center', marginBottom: spacing.md }]}>
            {selectedCategories.length} {t('motivation.categoriesSelected') || 'categories selected'}
          </Text>

          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonPrimary,
              selectedCategories.length === 0 && { opacity: 0.5 },
            ]}
            disabled={selectedCategories.length === 0}
          >
            <Text style={styles.buttonText}>
              {t('common.next')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
