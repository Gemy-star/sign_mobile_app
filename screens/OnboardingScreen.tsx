// screens/OnboardingScreen.tsx
// First-launch onboarding journey shown before sign-in

import { useLanguage } from '@/contexts/LanguageContext';
import { Button, Icon, Text } from '@ui-kitten/components';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// --- Slide types ---

type ContentSlide = {
  type: 'content';
  id: string;
  illustrationKey: 'logo' | 'ai' | 'goals';
  titleKey: string;
  descKey: string;
  bg: string;
  accent: string;
};

type ScopeSlide = {
  type: 'scopes';
  id: string;
  titleKey: string;
  descKey: string;
  bg: string;
  accent: string;
};

type AnySlide = ContentSlide | ScopeSlide;

// --- Slide data ---

const SLIDES: AnySlide[] = [
  {
    type: 'content',
    id: '1',
    illustrationKey: 'logo',
    titleKey: 'onboarding.slide1Title',
    descKey: 'onboarding.slide1Desc',
    bg: '#53321D',
    accent: '#C96F4A',
  },
  {
    type: 'content',
    id: '2',
    illustrationKey: 'ai',
    titleKey: 'onboarding.slide2Title',
    descKey: 'onboarding.slide2Desc',
    bg: '#311E13',
    accent: '#E8CE80',
  },
  {
    type: 'content',
    id: '3',
    illustrationKey: 'goals',
    titleKey: 'onboarding.slide3Title',
    descKey: 'onboarding.slide3Desc',
    bg: '#1A0F08',
    accent: '#C96F4A',
  },
  {
    type: 'scopes',
    id: 'scopes',
    titleKey: 'onboarding.slide4Title',
    descKey: 'onboarding.slide4Desc',
    bg: '#1A0F08',
    accent: '#E8CE80',
  },
];

// --- Scope items ---

interface ScopeItem {
  id: string;
  labelKey: string;
  icon: string;
  color: string;
}

const SCOPE_ITEMS: ScopeItem[] = [
  { id: 'mental',        labelKey: 'onboarding.scopeMental',        icon: 'flash-outline',       color: '#9B8FEF' },
  { id: 'physical',      labelKey: 'onboarding.scopePhysical',      icon: 'heart-outline',       color: '#48BB78' },
  { id: 'career',        labelKey: 'onboarding.scopeCareer',        icon: 'bar-chart-outline',   color: '#4299E1' },
  { id: 'financial',     labelKey: 'onboarding.scopeFinancial',     icon: 'trending-up-outline', color: '#ECC94B' },
  { id: 'relationships', labelKey: 'onboarding.scopeRelationships', icon: 'people-outline',      color: '#F687B3' },
  { id: 'spiritual',     labelKey: 'onboarding.scopeSpiritual',     icon: 'star-outline',        color: '#C96F4A' },
  { id: 'creativity',    labelKey: 'onboarding.scopeCreativity',    icon: 'bulb-outline',        color: '#E8CE80' },
  { id: 'social',        labelKey: 'onboarding.scopeSocial',        icon: 'globe-outline',       color: '#68D391' },
];

// --- Illustration mapping ---

const illustrations: Record<ContentSlide['illustrationKey'], number> = {
  logo:  require('@/assets/images/logo.png') as number,
  ai:    require('@/assets/images/loader.png') as number,
  goals: require('@/assets/images/logo.png') as number,
};

// --- Dot indicator ---

const DOT_KEYS = ['dot-first', 'dot-second', 'dot-third', 'dot-fourth', 'dot-fifth'];

const Dots = ({ total, active }: { readonly total: number; readonly active: number }) => (
  <View style={styles.dotsRow}>
    {Array.from({ length: total }).map((_, i) => (
      <View
        key={DOT_KEYS[i]}
        style={[styles.dot, i === active ? styles.dotActive : styles.dotInactive]}
      />
    ))}
  </View>
);

// --- Content slide ---

const SlideItem = ({ item }: { readonly item: ContentSlide }) => {
  const { t, isRTL } = useLanguage();
  return (
    <View style={[styles.slide, { backgroundColor: item.bg }]}>
      <View style={[styles.circle, { backgroundColor: item.accent + '22' }]} />

      <View style={styles.imageWrapper}>
        <View style={[styles.imageCircle, { borderColor: item.accent + '55' }]}>
          <Image
            source={illustrations[item.illustrationKey]}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={[styles.textBlock, isRTL && styles.textBlockRTL]}>
        <Text category="h2" style={[styles.title, { color: item.accent }, isRTL && styles.textRTL]}>
          {t(item.titleKey)}
        </Text>
        <Text category="p1" style={[styles.desc, isRTL && styles.textRTL]}>
          {t(item.descKey)}
        </Text>
      </View>
    </View>
  );
};

// --- Scope picker slide ---

interface ScopePickerSlideProps {
  readonly item: ScopeSlide;
  readonly selectedScopes: string[];
  readonly onToggleScope: (id: string) => void;
}

const ScopePickerSlide = ({ item, selectedScopes, onToggleScope }: ScopePickerSlideProps) => {
  const { t, isRTL } = useLanguage();
  const chipWidth = (width - 96) / 2;

  return (
    <View style={[styles.slide, styles.scopeSlide, { backgroundColor: item.bg }]}>
      <View style={[styles.scopeHeader, isRTL && styles.textBlockRTL]}>
        <Text category="h3" style={[styles.title, { color: item.accent }, isRTL && styles.textRTL]}>
          {t(item.titleKey)}
        </Text>
        <Text category="p2" style={[styles.scopeDesc, isRTL && styles.textRTL]}>
          {t(item.descKey)}
        </Text>
      </View>

      <View style={styles.scopeGrid}>
        {SCOPE_ITEMS.map((scope) => {
          const selected = selectedScopes.includes(scope.id);
          return (
            <TouchableOpacity
              key={scope.id}
              style={[
                styles.scopeChip,
                { width: chipWidth },
                selected
                  ? { borderColor: scope.color, backgroundColor: scope.color + '22' }
                  : styles.scopeChipUnselected,
              ]}
              onPress={() => onToggleScope(scope.id)}
              activeOpacity={0.75}
            >
              <Icon
                name={scope.icon}
                width={20}
                height={20}
                fill={selected ? scope.color : '#736059'}
              />
              <Text
                category="s2"
                numberOfLines={1}
                style={[
                  styles.scopeLabel,
                  { color: selected ? scope.color : '#D5CCC3' },
                  isRTL && styles.textRTL,
                ]}
              >
                {t(scope.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// --- Main component ---

interface OnboardingScreenProps {
  readonly onFinish: (selectedScopes: string[]) => void;
}

export default function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
  const { t, isRTL } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [scopeError, setScopeError] = useState(false);
  const flatRef = useRef<FlatList<AnySlide>>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const isLast = activeIndex === SLIDES.length - 1;

  const onViewRef = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    }
  );

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const toggleScope = (id: string) => {
    setScopeError(false);
    setSelectedScopes((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const goTo = (index: number) => {
    flatRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
  };

  const handleNext = () => {
    if (isLast) {
      if (selectedScopes.length === 0) {
        setScopeError(true);
        return;
      }
      finish();
    } else {
      goTo(activeIndex + 1);
    }
  };

  const finish = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onFinish(selectedScopes));
  };

  const currentBg = SLIDES[activeIndex].bg;
  const currentAccent = SLIDES[activeIndex].accent;

  const renderSlide = ({ item }: { readonly item: AnySlide }) => {
    if (item.type === 'scopes') {
      return (
        <ScopePickerSlide
          item={item}
          selectedScopes={selectedScopes}
          onToggleScope={toggleScope}
        />
      );
    }
    return <SlideItem item={item} />;
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: currentBg }]}>
      <FlatList
        ref={flatRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        scrollEventThrottle={16}
      />

      <View style={styles.controls}>
        <Dots total={SLIDES.length} active={activeIndex} />

        {scopeError && (
          <Text category="c1" style={[styles.scopeErrorText, isRTL && styles.textRTL]}>
            {t('onboarding.selectAtLeastOne')}
          </Text>
        )}

        <Button
          style={[styles.nextBtn, { backgroundColor: currentAccent, borderColor: currentAccent }]}
          onPress={handleNext}
          size="large"
        >
          {isLast ? t('onboarding.getStarted') : t('common.next')}
        </Button>

        {!isLast && (
          <TouchableOpacity onPress={finish} style={styles.skipBtn}>
            <Text category="c1" style={[styles.skipText, isRTL && styles.textRTL]}>
              {t('onboarding.skip')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: height * 0.08,
    paddingBottom: 180,
  },
  circle: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  imageWrapper: {
    marginBottom: 44,
  },
  imageCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  image: {
    width: 120,
    height: 120,
  },
  textBlock: {
    alignItems: 'flex-start',
    width: '100%',
  },
  textBlockRTL: {
    alignItems: 'flex-end',
  },
  title: {
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 36,
  },
  desc: {
    color: '#D5CCC3',
    fontSize: 16,
    lineHeight: 26,
  },
  textRTL: {
    textAlign: 'right',
  },
  scopeSlide: {
    justifyContent: 'flex-start',
    paddingTop: height * 0.07,
    paddingBottom: 190,
  },
  scopeHeader: {
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 20,
  },
  scopeDesc: {
    color: '#D5CCC3',
    fontSize: 14,
    lineHeight: 20,
  },
  scopeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    width: '100%',
  },
  scopeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  scopeChipUnselected: {
    borderColor: '#4D3527',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  scopeLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  scopeErrorText: {
    color: '#C96F4A',
    textAlign: 'center',
    marginBottom: -4,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 32,
    paddingBottom: 48,
    alignItems: 'center',
    gap: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#C96F4A',
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#936036',
  },
  nextBtn: {
    width: '100%',
    borderRadius: 14,
  },
  skipBtn: {
    paddingVertical: 4,
  },
  skipText: {
    color: '#936036',
    letterSpacing: 0.5,
  },
});
