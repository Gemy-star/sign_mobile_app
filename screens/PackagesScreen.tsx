// screens/PackagesScreen.tsx
// Packages (Subscription Plans) Screen — styled to match DashboardScreen

import AppHeader from '@/components/AppHeader';
import { FontFamily } from '@/constants/Typography';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPackages } from '@/store/slices/packagesSlice';
import { fetchScopes } from '@/store/slices/scopesSlice';
import { createSubscription } from '@/store/slices/subscriptionsSlice';
import { Package, Scope } from '@/types/api';
import { logger } from '@/utils/logger';
import { Icon, Spinner } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

// ─── Design tokens (same palette as DashboardScreen) ────────────────────────
const BG_COLOR = '#53321D';
const CARD_BG = 'rgba(49, 30, 19, 0.70)';
const CARD_BORDER = 'rgba(250, 248, 245, 0.12)';
const TEXT_PRIMARY = '#FAF8F5';
const TEXT_MUTED = 'rgba(250, 248, 245, 0.60)';
const ACCENT = '#A48111';
const ACCENT_SOLID = '#D4A820';
const DIVIDER = 'rgba(250, 248, 245, 0.10)';
const SUCCESS = '#4CAF82';
const DANGER = 'rgba(250, 248, 245, 0.25)';

interface PackagesScreenProps {
  onComplete?: () => void;
}

export default function PackagesScreen({ onComplete }: PackagesScreenProps = {}) {
  const { t, isRTL } = useLanguage();
  const dispatch = useAppDispatch();

  const { packages, isLoading: packagesLoading } = useAppSelector((s) => s.packages);
  const { scopes, isLoading: scopesLoading } = useAppSelector((s) => s.scopes);

  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedScopes, setSelectedScopes] = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'select-package' | 'select-scopes' | 'payment'>(
    'select-package',
  );

  const isLoading = packagesLoading || scopesLoading;

  useEffect(() => {
    dispatch(fetchPackages());
    dispatch(fetchScopes());
  }, [dispatch]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setSelectedScopes([]);
    setStep('select-scopes');
  };

  const handleToggleScope = (scopeId: number) => {
    if (!selectedPackage) return;
    const max = selectedPackage.max_scopes || 0;
    if (selectedScopes.includes(scopeId)) {
      setSelectedScopes(selectedScopes.filter((id) => id !== scopeId));
    } else {
      if (selectedScopes.length >= max) {
        Alert.alert(
          t('packages.scopeLimitTitle'),
          t('packages.scopeLimitMessage', { max }),
        );
        return;
      }
      setSelectedScopes([...selectedScopes, scopeId]);
    }
  };

  const handleContinue = () => {
    if (!selectedPackage) return;
    if (selectedScopes.length === 0) {
      Alert.alert(t('packages.noScopesTitle'), t('packages.noScopesMessage'));
      return;
    }
    if (Number.parseFloat(selectedPackage.price) === 0) {
      handleStartFreeTrial();
    } else {
      setStep('payment');
    }
  };

  const handleStartFreeTrial = async () => {
    if (!selectedPackage) return;
    try {
      setProcessing(true);
      logger.info('Starting free trial', {
        packageId: selectedPackage.id,
        scopes: selectedScopes,
      });
      const result = await dispatch(
        createSubscription({ package_id: selectedPackage.id, selected_scope_ids: selectedScopes }),
      );
      if (createSubscription.fulfilled.match(result)) {
        logger.info('Free trial started successfully');
        Alert.alert(t('packages.freeTrialSuccess'), t('packages.freeTrialSuccessMessage'), [
          {
            text: t('common.done'),
            onPress: () => (onComplete ? onComplete() : router.replace('/(tabs)')),
          },
        ]);
      } else {
        const msg = (result.payload as string) || t('packages.subscriptionError');
        Alert.alert(t('common.error'), msg);
      }
    } catch (error) {
      logger.error('Start free trial error', error as Error);
      Alert.alert(t('common.error'), t('packages.subscriptionError'));
    } finally {
      setProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedPackage) return;
    try {
      setProcessing(true);
      const result = await dispatch(
        createSubscription({ package_id: selectedPackage.id, selected_scope_ids: selectedScopes }),
      );
      if (createSubscription.fulfilled.match(result)) {
        Alert.alert(t('packages.paymentSuccess'), t('packages.paymentSuccessMessage'), [
          {
            text: t('common.done'),
            onPress: () => (onComplete ? onComplete() : router.replace('/(tabs)')),
          },
        ]);
      } else {
        const msg = (result.payload as string) || t('packages.paymentError');
        Alert.alert(t('common.error'), msg);
      }
    } catch (error) {
      logger.error('Payment error', error as Error);
      Alert.alert(t('common.error'), t('packages.paymentError'));
    } finally {
      setProcessing(false);
    }
  };

  // ─── Shared layout ────────────────────────────────────────────────────────

  const renderShell = (children: React.ReactNode) => (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(49,30,19,0.90)', 'rgba(83,50,29,0.95)', 'rgba(49,30,19,0.90)']}
        style={StyleSheet.absoluteFillObject}
      />
      <AppHeader showBack={true} />
      {children}
    </View>
  );

  // ─── Loading ──────────────────────────────────────────────────────────────

  if (isLoading && packages.length === 0) {
    return renderShell(
      <View style={styles.center}>
        <Spinner size="giant" status="warning" />
        <Text style={[styles.muted, { marginTop: 14 }]}>{t('packages.loading')}</Text>
      </View>,
    );
  }

  // ─── Step: select package ─────────────────────────────────────────────────

  if (step === 'select-package') {
    return renderShell(
      <>
        <View style={[styles.banner, isRTL && styles.bannerRTL]}>
          <Text style={[styles.bannerTitle, isRTL && styles.textRTL]}>{t('packages.title')}</Text>
          <Text style={[styles.bannerSubtitle, isRTL && styles.textRTL]}>
            {t('packages.subtitle')}
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              isSelected={selectedPackage?.id === pkg.id}
              isRTL={isRTL}
              t={t}
              onPress={handleSelectPackage}
            />
          ))}
        </ScrollView>
      </>,
    );
  }

  // ─── Step: select scopes ──────────────────────────────────────────────────

  if (step === 'select-scopes') {
    const activeScopes = scopes.filter((s) => s.is_active);
    const max = selectedPackage?.max_scopes || 0;

    return renderShell(
      <>
        <View style={[styles.banner, isRTL && styles.bannerRTL]}>
          <Text style={[styles.bannerTitle, isRTL && styles.textRTL]}>
            {t('packages.selectScopes')}
          </Text>
          <Text style={[styles.bannerSubtitle, isRTL && styles.textRTL]}>
            {t('packages.selectScopesHint', { selected: selectedScopes.length, max })}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${max > 0 ? (selectedScopes.length / max) * 100 : 0}%` },
              ]}
            />
          </View>

          <View style={styles.scopesGrid}>
            {activeScopes.map((scope) => (
              <ScopeCard
                key={scope.id}
                scope={scope}
                isSelected={selectedScopes.includes(scope.id)}
                isDisabled={
                  !selectedScopes.includes(scope.id) && selectedScopes.length >= max
                }
                onPress={handleToggleScope}
              />
            ))}
          </View>

          <View style={[styles.actionRow, isRTL && styles.actionRowRTL]}>
            <TouchableOpacity
              style={styles.btnOutline}
              onPress={() => {
                setStep('select-package');
                setSelectedScopes([]);
              }}
              disabled={processing}
              activeOpacity={0.8}
            >
              <Text style={styles.btnOutlineText}>{t('common.back')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnPrimary, (processing || selectedScopes.length === 0) && styles.btnDisabled]}
              onPress={handleContinue}
              disabled={processing || selectedScopes.length === 0}
              activeOpacity={0.8}
            >
              {processing ? (
                <Spinner size="small" status="control" />
              ) : (
                <Text style={styles.btnPrimaryText}>
                  {Number.parseFloat(selectedPackage?.price || '0') === 0
                    ? t('packages.startFreeTrial')
                    : t('packages.continueToPayment')}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>,
    );
  }

  // ─── Step: payment ────────────────────────────────────────────────────────

  return renderShell(
    <>
      <View style={[styles.banner, isRTL && styles.bannerRTL]}>
        <Text style={[styles.bannerTitle, isRTL && styles.textRTL]}>
          {t('packages.paymentTitle')}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryHeading, isRTL && styles.textRTL]}>
            {t('packages.orderSummary')}
          </Text>

          <View style={[styles.summaryRow, isRTL && styles.summaryRowRTL]}>
            <Text style={[styles.muted, isRTL && styles.textRTL]}>{t('packages.package')}</Text>
            <Text style={[styles.summaryValue, isRTL && styles.textRTL]}>
              {selectedPackage?.name}
            </Text>
          </View>

          <View style={[styles.summaryRow, isRTL && styles.summaryRowRTL]}>
            <Text style={[styles.muted, isRTL && styles.textRTL]}>
              {t('packages.selectedScopes')}
            </Text>
            <Text style={[styles.summaryValue, isRTL && styles.textRTL]}>
              {selectedScopes.length} {t('packages.scopes')}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={[styles.summaryRow, isRTL && styles.summaryRowRTL]}>
            <Text style={[styles.summaryTotal, isRTL && styles.textRTL]}>
              {t('packages.total')}
            </Text>
            <Text style={[styles.summaryTotalValue, isRTL && styles.textRTL]}>
              {selectedPackage?.price} {t('packages.currency')}
            </Text>
          </View>
        </View>

        <Text style={[styles.paymentNote, isRTL && styles.textRTL]}>{t('packages.paymentNote')}</Text>

        <View style={[styles.actionRow, isRTL && styles.actionRowRTL]}>
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => setStep('select-scopes')}
            disabled={processing}
            activeOpacity={0.8}
          >
            <Text style={styles.btnOutlineText}>{t('common.back')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnPrimary, processing && styles.btnDisabled]}
            onPress={handlePayment}
            disabled={processing}
            activeOpacity={0.8}
          >
            {processing ? (
              <Spinner size="small" status="control" />
            ) : (
              <Text style={styles.btnPrimaryText}>{t('packages.pay')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>,
  );
}

// ─── Package Card ─────────────────────────────────────────────────────────────

interface PackageCardProps {
  pkg: Package;
  isSelected: boolean;
  isRTL: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
  onPress: (pkg: Package) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg, isSelected, isRTL, t, onPress }) => {
  const isFree = Number.parseFloat(pkg.price) === 0;

  return (
    <TouchableOpacity
      style={[
        styles.packageCard,
        isSelected && styles.packageCardSelected,
        pkg.is_featured && styles.packageCardFeatured,
      ]}
      onPress={() => onPress(pkg)}
      activeOpacity={0.85}
    >
      {/* Popular badge */}
      {pkg.is_featured && (
        <View style={[styles.popularBadge, isRTL ? styles.popularBadgeLeft : styles.popularBadgeRight]}>
          <Icon name="star" style={styles.popularBadgeIcon} fill="#FAF8F5" />
          <Text style={styles.popularBadgeText}>{t('packages.popular')}</Text>
        </View>
      )}

      {/* Name */}
      <Text style={[styles.pkgName, isRTL && styles.textRTL]}>{pkg.name}</Text>

      {/* Price */}
      <View style={[styles.priceRow, isRTL && styles.priceRowRTL]}>
        <Text style={styles.priceAmount}>
          {isFree ? t('packages.free') : pkg.price}
        </Text>
        {!isFree && (
          <View style={[styles.priceMeta, isRTL && { alignItems: 'flex-end' }]}>
            <Text style={styles.priceCurrency}>{t('packages.currency')}</Text>
            <Text style={styles.priceDuration}>
              / {pkg.duration_display || t(`packages.duration.${pkg.duration}`)}
            </Text>
          </View>
        )}
      </View>

      {/* Description */}
      {!!pkg.description && (
        <Text style={[styles.pkgDescription, isRTL && styles.textRTL]}>{pkg.description}</Text>
      )}

      {/* Feature list */}
      <View style={styles.featureList}>
        <FeatureRow
          enabled
          text={t('packages.features.scopes', { count: pkg.max_scopes })}
          isRTL={isRTL}
        />
        <FeatureRow
          enabled
          text={t('packages.features.messages', { count: pkg.messages_per_day })}
          isRTL={isRTL}
        />
        <FeatureRow
          enabled={pkg.custom_goals_enabled}
          text={t('packages.features.customGoals')}
          isRTL={isRTL}
        />
        <FeatureRow
          enabled={pkg.priority_support}
          text={t('packages.features.prioritySupport')}
          isRTL={isRTL}
        />
      </View>

      {/* Select button */}
      <View
        style={[
          styles.selectBtn,
          isSelected ? styles.selectBtnActive : styles.selectBtnInactive,
        ]}
      >
        {isSelected && (
          <Icon name="checkmark" style={styles.selectBtnIcon} fill={TEXT_PRIMARY} />
        )}
        <Text style={styles.selectBtnText}>
          {isSelected ? t('packages.selected') : (isFree ? t('packages.startFreeTrial') : t('common.next'))}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ─── Feature Row ──────────────────────────────────────────────────────────────

const FeatureRow: React.FC<{ enabled: boolean; text: string; isRTL: boolean }> = ({
  enabled,
  text,
  isRTL,
}) => (
  <View style={[styles.featureRow, isRTL && styles.featureRowRTL]}>
    <Icon
      name={enabled ? 'checkmark-circle-2' : 'close-circle'}
      style={styles.featureIcon}
      fill={enabled ? SUCCESS : DANGER}
    />
    <Text style={[styles.featureText, !enabled && styles.featureTextDisabled, isRTL && styles.textRTL]}>
      {text}
    </Text>
  </View>
);

// ─── Scope Card ────────────────────────────────────────────────────────────────

interface ScopeCardProps {
  scope: Scope;
  isSelected: boolean;
  isDisabled: boolean;
  onPress: (id: number) => void;
}

const ScopeCard: React.FC<ScopeCardProps> = ({ scope, isSelected, isDisabled, onPress }) => (
  <TouchableOpacity
    style={[
      styles.scopeCard,
      isSelected && styles.scopeCardSelected,
      isDisabled && styles.scopeCardDisabled,
    ]}
    onPress={() => onPress(scope.id)}
    disabled={isDisabled}
    activeOpacity={0.8}
  >
    <Text style={styles.scopeEmoji}>{scope.icon || '⭐'}</Text>
    <Text
      style={[styles.scopeName, isSelected && styles.scopeNameSelected]}
      numberOfLines={2}
    >
      {scope.name}
    </Text>
    {isSelected && (
      <View style={styles.scopeCheck}>
        <Icon name="checkmark" style={styles.scopeCheckIcon} fill={TEXT_PRIMARY} />
      </View>
    )}
  </TouchableOpacity>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Banner
  banner: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DIVIDER,
    backgroundColor: CARD_BG,
  },
  bannerRTL: {
    alignItems: 'flex-end',
  },
  bannerTitle: {
    fontSize: 22,
    fontFamily: FontFamily.arabicBold,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    fontFamily: FontFamily.arabic,
    color: TEXT_MUTED,
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  // Scroll
  scrollContent: {
    padding: 18,
    paddingBottom: 100,
  },
  // Package card
  packageCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    position: 'relative',
    overflow: 'hidden',
  },
  packageCardSelected: {
    borderColor: ACCENT_SOLID,
    borderWidth: 2,
  },
  packageCardFeatured: {
    borderColor: ACCENT,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ACCENT,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeLeft: { left: 12 },
  popularBadgeRight: { right: 12 },
  popularBadgeIcon: { width: 11, height: 11 },
  popularBadgeText: {
    color: TEXT_PRIMARY,
    fontSize: 11,
    fontFamily: FontFamily.arabicBold,
  },
  pkgName: {
    fontSize: 20,
    fontFamily: FontFamily.arabicBold,
    color: TEXT_PRIMARY,
    marginBottom: 10,
    marginTop: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    marginBottom: 10,
  },
  priceRowRTL: {
    flexDirection: 'row-reverse',
  },
  priceAmount: {
    fontSize: 34,
    fontFamily: FontFamily.arabicBold,
    color: ACCENT_SOLID,
    lineHeight: 38,
  },
  priceMeta: {
    paddingBottom: 4,
  },
  priceCurrency: {
    fontSize: 13,
    fontFamily: FontFamily.arabicMedium,
    color: TEXT_MUTED,
  },
  priceDuration: {
    fontSize: 12,
    fontFamily: FontFamily.arabic,
    color: TEXT_MUTED,
  },
  pkgDescription: {
    fontSize: 13,
    fontFamily: FontFamily.arabic,
    color: TEXT_MUTED,
    lineHeight: 20,
    marginBottom: 14,
  },
  featureList: {
    gap: 8,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureRowRTL: {
    flexDirection: 'row-reverse',
  },
  featureIcon: {
    width: 18,
    height: 18,
    flexShrink: 0,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FontFamily.arabicMedium,
    color: TEXT_PRIMARY,
  },
  featureTextDisabled: {
    color: TEXT_MUTED,
  },
  selectBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  selectBtnActive: {
    backgroundColor: ACCENT,
  },
  selectBtnInactive: {
    backgroundColor: 'rgba(250, 248, 245, 0.10)',
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  selectBtnIcon: { width: 16, height: 16 },
  selectBtnText: {
    fontSize: 15,
    fontFamily: FontFamily.arabicBold,
    color: TEXT_PRIMARY,
  },
  // Progress bar
  progressTrack: {
    height: 5,
    backgroundColor: 'rgba(250,248,245,0.12)',
    borderRadius: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: ACCENT_SOLID,
    borderRadius: 3,
  },
  // Scope grid
  scopesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  scopeCard: {
    width: (width - 48) / 2,
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 14,
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  scopeCardSelected: {
    backgroundColor: 'rgba(164,129,17,0.30)',
    borderColor: ACCENT_SOLID,
    borderWidth: 2,
  },
  scopeCardDisabled: {
    opacity: 0.4,
  },
  scopeEmoji: {
    fontSize: 28,
  },
  scopeName: {
    fontSize: 13,
    fontFamily: FontFamily.arabicMedium,
    color: TEXT_MUTED,
    textAlign: 'center',
  },
  scopeNameSelected: {
    color: TEXT_PRIMARY,
  },
  scopeCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scopeCheckIcon: { width: 12, height: 12 },
  // Action buttons
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionRowRTL: {
    flexDirection: 'row-reverse',
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  btnPrimaryText: {
    fontSize: 15,
    fontFamily: FontFamily.arabicBold,
    color: TEXT_PRIMARY,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnOutline: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: 'rgba(250,248,245,0.06)',
    minHeight: 50,
  },
  btnOutlineText: {
    fontSize: 15,
    fontFamily: FontFamily.arabicMedium,
    color: TEXT_MUTED,
  },
  // Payment summary
  summaryCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 20,
    gap: 12,
    marginBottom: 16,
  },
  summaryHeading: {
    fontSize: 17,
    fontFamily: FontFamily.arabicBold,
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryRowRTL: {
    flexDirection: 'row-reverse',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: FontFamily.arabicMedium,
    color: TEXT_PRIMARY,
  },
  summaryTotal: {
    fontSize: 16,
    fontFamily: FontFamily.arabicBold,
    color: TEXT_PRIMARY,
  },
  summaryTotalValue: {
    fontSize: 18,
    fontFamily: FontFamily.arabicBold,
    color: ACCENT_SOLID,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: DIVIDER,
    marginVertical: 4,
  },
  paymentNote: {
    fontSize: 12,
    fontFamily: FontFamily.arabic,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 19,
  },
  // Shared
  muted: {
    fontSize: 13,
    fontFamily: FontFamily.arabic,
    color: TEXT_MUTED,
  },
});
