// screens/PackagesScreen.tsx
// Packages (Subscription Plans) Screen with Free Trial and Payment Handling

import { useLanguage } from '@/contexts/LanguageContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPackages } from '@/store/slices/packagesSlice';
import { fetchScopes } from '@/store/slices/scopesSlice';
import { Package } from '@/types/api';
import { logger } from '@/utils/logger';
import { Button, Card, Icon, Layout, Spinner, Text, useTheme } from '@ui-kitten/components';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

const SmallSpinner = () => <Spinner size="small" status="control" />;

interface PackagesScreenProps {
  onComplete?: () => void;
}

export default function PackagesScreen({ onComplete }: PackagesScreenProps = {}) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const { packages, isLoading: packagesLoading } = useAppSelector((state) => state.packages);
  const { scopes, isLoading: scopesLoading } = useAppSelector((state) => state.scopes);

  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedScopes, setSelectedScopes] = useState<number[]>([]);
  const loading = packagesLoading || scopesLoading;
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'select-package' | 'select-scopes' | 'payment'>('select-package');

  useEffect(() => {
    dispatch(fetchPackages());
    dispatch(fetchScopes());
  }, [dispatch]);

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setSelectedScopes([]);
    setStep('select-scopes');
  };

  const handleToggleScope = (scopeId: number) => {
    if (!selectedPackage) return;

    const maxScopes = selectedPackage.max_scopes || 0;

    if (selectedScopes.includes(scopeId)) {
      setSelectedScopes(selectedScopes.filter(id => id !== scopeId));
    } else {
      if (selectedScopes.length >= maxScopes) {
        Alert.alert(
          t('packages.scopeLimitTitle'),
          t('packages.scopeLimitMessage', { max: maxScopes })
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

    // Check if it's a free trial
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
        scopes: selectedScopes
      });

      const result = await dispatch(createSubscription({
        package_id: selectedPackage.id,
        selected_scope_ids: selectedScopes,
      }));

      if (createSubscription.fulfilled.match(result)) {
        logger.info('Free trial started successfully');
        Alert.alert(
          t('packages.freeTrialSuccess'),
          t('packages.freeTrialSuccessMessage'),
          [
            {
              text: t('common.done'),
              onPress: () => {
                if (onComplete) {
                  onComplete();
                } else {
                  router.replace('/(tabs)');
                }
              }
            }
          ]
        );
      } else {
        const errMsg = result.payload as string || t('packages.subscriptionError');
        logger.warn('Failed to start free trial', { error: errMsg });
        Alert.alert(t('common.error'), errMsg);
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
      logger.info('Processing payment', {
        packageId: selectedPackage.id,
        scopes: selectedScopes
      });

      const result = await dispatch(createSubscription({
        package_id: selectedPackage.id,
        selected_scope_ids: selectedScopes,
      }));

      if (createSubscription.fulfilled.match(result)) {
        logger.info('Subscription created successfully');
        Alert.alert(
          t('packages.paymentSuccess'),
          t('packages.paymentSuccessMessage'),
          [
            {
              text: t('common.done'),
              onPress: () => {
                if (onComplete) {
                  onComplete();
                } else {
                  router.replace('/(tabs)');
                }
              }
            }
          ]
        );
      } else {
        const errMsg = result.payload as string || t('packages.paymentError');
        logger.warn('Failed to create subscription', { error: errMsg });
        Alert.alert(t('common.error'), errMsg);
      }
    } catch (error) {
      logger.error('Payment error', error as Error);
      Alert.alert(t('common.error'), t('packages.paymentError'));
    } finally {
      setProcessing(false);
    }
  };

  const renderPackageCard = (pkg: Package) => {
    const isFree = Number.parseFloat(pkg.price) === 0;
    const isSelected = selectedPackage?.id === pkg.id;

    return (
      <Card
        key={pkg.id}
        style={[
          styles.packageCard,
          isSelected && { borderColor: theme['color-primary-500'], borderWidth: 2 },
          pkg.is_featured && styles.featuredCard,
        ]}
        onPress={() => handleSelectPackage(pkg)}
        disabled={processing}
      >
        {pkg.is_featured && (
          <View style={[styles.badge, { backgroundColor: theme['color-primary-500'] }, isRTL ? { left: 20 } : { right: 20 }]}>
            <Text category="c1" style={styles.badgeText}>{t('packages.popular')}</Text>
          </View>
        )}

        <Text category="h5" style={styles.packageName}>
          {pkg.name}
        </Text>

        <View style={styles.priceContainer}>
          <Text category="h3" style={[styles.price, { color: theme['color-primary-500'] }]}>
            {isFree ? t('packages.free') : `${pkg.price} ${t('packages.currency')}`}
          </Text>
          <Text appearance="hint" category="s1">
            {pkg.duration_display || t(`packages.duration.${pkg.duration}`)}
          </Text>
        </View>

        <Text appearance="hint" style={styles.packageDescription}>
          {pkg.description}
        </Text>

        <View style={styles.featuresContainer}>
          <PackageFeature
            icon="checkmark-circle-2"
            text={t('packages.features.scopes', { count: pkg.max_scopes })}
            enabled={true}
          />
          <PackageFeature
            icon="checkmark-circle-2"
            text={t('packages.features.messages', { count: pkg.messages_per_day })}
            enabled={true}
          />
          <PackageFeature
            icon={pkg.custom_goals_enabled ? 'checkmark-circle-2' : 'close-circle'}
            text={t('packages.features.customGoals')}
            enabled={pkg.custom_goals_enabled}
          />
          <PackageFeature
            icon={pkg.priority_support ? 'checkmark-circle-2' : 'close-circle'}
            text={t('packages.features.prioritySupport')}
            enabled={pkg.priority_support}
          />
        </View>

        {isSelected && (
          <View style={[styles.selectedIndicator, { backgroundColor: theme['color-primary-500'] }]}>
            <Icon name="checkmark" style={styles.selectedIcon} fill="white" />
            <Text style={styles.selectedText}>{t('packages.selected')}</Text>
          </View>
        )}
      </Card>
    );
  };

  const renderScopeSelection = () => (
    <View style={styles.scopeSelectionContainer}>
      <Text category="h5" style={styles.sectionTitle}>
        {t('packages.selectScopes')}
      </Text>
      <Text appearance="hint" style={styles.sectionSubtitle}>
        {t('packages.selectScopesHint', {
          selected: selectedScopes.length,
          max: selectedPackage?.max_scopes || 0
        })}
      </Text>

      <View style={styles.scopesGrid}>
        {scopes.filter((s) => s.is_active).map((scope) => {
          const isSelected = selectedScopes.includes(scope.id);
          const isDisabled = !isSelected && selectedScopes.length >= (selectedPackage?.max_scopes || 0);

          return (
            <Card
              key={scope.id}
              style={[
                styles.scopeCard,
                isSelected && { backgroundColor: theme['color-primary-500'] },
                isDisabled && { opacity: 0.5 },
              ]}
              onPress={() => handleToggleScope(scope.id)}
              disabled={isDisabled}
            >
              <Icon
                name={scope.icon || 'star'}
                style={styles.scopeIcon}
                fill={isSelected ? 'white' : theme['text-basic-color']}
              />
              <Text
                category="s1"
                style={[
                  styles.scopeName,
                  { color: isSelected ? 'white' : theme['text-basic-color'] }
                ]}
              >
                {scope.name}
              </Text>
            </Card>
          );
        })}
      </View>

      <View style={[styles.actionButtons, isRTL && { flexDirection: 'row-reverse' }]}>
        <Button
          style={styles.button}
          appearance="outline"
          onPress={() => {
            setStep('select-package');
            setSelectedScopes([]);
          }}
          disabled={processing}
        >
          {t('common.back')}
        </Button>

        <Button
          style={styles.button}
          onPress={handleContinue}
          disabled={processing || selectedScopes.length === 0}
          accessoryLeft={processing ? SmallSpinner : undefined}
        >
          {!processing && (Number.parseFloat(selectedPackage?.price || '0') === 0
            ? t('packages.startFreeTrial')
            : t('packages.continueToPayment'))}
        </Button>
      </View>
    </View>
  );

  const renderPayment = () => (
    <View style={styles.paymentContainer}>
      <Text category="h5" style={styles.sectionTitle}>
        {t('packages.paymentTitle')}
      </Text>

      <Card style={styles.summaryCard}>
        <Text category="h6">{t('packages.orderSummary')}</Text>

        <View style={[styles.summaryRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <Text appearance="hint">{t('packages.package')}</Text>
          <Text>{selectedPackage?.name}</Text>
        </View>

        <View style={[styles.summaryRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <Text appearance="hint">{t('packages.selectedScopes')}</Text>
          <Text>{selectedScopes.length} {t('packages.scopes')}</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={[styles.summaryRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <Text category="h6">{t('packages.total')}</Text>
          <Text category="h6" style={{ color: theme['color-primary-500'] }}>
            {selectedPackage?.price} {t('packages.currency')}
          </Text>
        </View>
      </Card>

      <Text appearance="hint" style={styles.paymentNote}>
        {t('packages.paymentNote')}
      </Text>

      <View style={[styles.actionButtons, isRTL && { flexDirection: 'row-reverse' }]}>
        <Button
          style={styles.button}
          appearance="outline"
          onPress={() => setStep('select-scopes')}
          disabled={processing}
        >
          {t('common.back')}
        </Button>

        <Button
          style={styles.button}
          onPress={handlePayment}
          disabled={processing}
          accessoryLeft={processing ? SmallSpinner : undefined}
        >
          {!processing && t('packages.pay')}
        </Button>
      </View>
    </View>
  );

  if (loading) {
    return (
      <Layout style={styles.loadingContainer} level="1">
        <Spinner size="giant" />
        <Text style={styles.loadingText}>{t('packages.loading')}</Text>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container} level="1">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {step === 'select-package' && (
          <>
            <Text category="h4" style={styles.title}>
              {t('packages.title')}
            </Text>
            <Text appearance="hint" style={styles.subtitle}>
              {t('packages.subtitle')}
            </Text>

            {packages.map(renderPackageCard)}
          </>
        )}

        {step === 'select-scopes' && renderScopeSelection()}
        {step === 'payment' && renderPayment()}
      </ScrollView>
    </Layout>
  );
}

// Helper component for package features
const PackageFeature: React.FC<{
  icon: string;
  text: string;
  enabled?: boolean;
}> = ({ icon, text, enabled = true }) => {
  const theme = useTheme();
  const { isRTL } = useLanguage();

  return (
    <View style={[styles.featureRow, isRTL && { flexDirection: 'row-reverse' }]}>
      <Icon
        name={icon}
        style={styles.featureIcon}
        fill={enabled ? theme['color-success-500'] : theme['text-hint-color']}
      />
      <Text
        appearance={enabled ? 'default' : 'hint'}
        category="s1"
        style={styles.featureText}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 24,
    textAlign: 'center',
  },
  packageCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    position: 'relative',
  },
  featuredCard: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  badge: {
    position: 'absolute',
    top: -8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  packageName: {
    marginBottom: 8,
  },
  priceContainer: {
    marginBottom: 12,
  },
  price: {
    marginBottom: 4,
  },
  packageDescription: {
    marginBottom: 16,
  },
  featuresContainer: {
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureIcon: {
    width: 20,
    height: 20,
  },
  featureText: {
    flex: 1,
  },
  scopeIcon: {
    width: 24,
    height: 24,
  },
  selectedIcon: {
    width: 20,
    height: 20,
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scopeSelectionContainer: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  sectionSubtitle: {
    marginBottom: 24,
  },
  scopesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  scopeCard: {
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    gap: 8,
  },
  scopeName: {
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
  },
  paymentContainer: {
    flex: 1,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 12,
    marginVertical: 16,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  paymentNote: {
    textAlign: 'center',
    fontSize: 12,
  },
});
