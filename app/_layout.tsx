import { customTheme } from '@/constants/theme';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { useAuthActions, useAuthState } from '@/hooks/useAuth';
import LoginScreen from '@/screens/LoginScreen';
import OnboardingScreen from '@/screens/OnboardingScreen';
import PackagesScreen from '@/screens/PackagesScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import WelcomeMotivationScreen from '@/screens/WelcomeMotivationScreen';
import { apiClient } from '@/services/api.client';
import { dataSource } from '@/services/dataSource.service';
import { store } from '@/store';
import { logger } from '@/utils/logger';
import { dark as evaDark, light as evaLight, mapping } from '@eva-design/eva';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApplicationProvider, IconRegistry, Layout, Spinner, Text } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const AuthenticatedLayout = () => {
  return (
    <View style={styles.contentArea}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
};

const ONBOARDING_KEY = '@sign_sa_onboarding_complete';

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuthState();
  const { checkAuth } = useAuthActions();
  const { colorScheme } = useTheme();
  const { language } = useLanguage();
  const [showScopeOnboarding, setShowScopeOnboarding] = useState<boolean | null>(null);
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);
  const [showPackages, setShowPackages] = useState<boolean | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  const isDark = colorScheme === 'dark';

  // Update API client language when language changes
  useEffect(() => {
    apiClient.setLanguage(language);
  }, [language]);

  // Check whether first-launch onboarding has been seen
  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((val) => {
      setOnboardingDone(val === 'true');
    });
  }, []);

  const handleOnboardingFinish = async (selectedScopes: string[]) => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    if (selectedScopes.length > 0) {
      await AsyncStorage.setItem('@sign_sa_onboarding_scopes', JSON.stringify(selectedScopes));
    }
    setOnboardingDone(true);
  };

  useEffect(() => {
    // Check if user is already logged in on mount
    checkAuth();
  }, []);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!isLoading && isAuthenticated && showScopeOnboarding === null) {
        const topicsSelected = await AsyncStorage.getItem('@sign_sa_topics_selected');

        if (topicsSelected === 'true') {
          setShowWelcome(true);
          checkSubscription();
        } else {
          setShowScopeOnboarding(true);
        }
      }
    };

    const checkSubscription = async () => {
      try {
        setCheckingSubscription(true);
        const response = await dataSource.getActiveSubscription();

        if (response.success && response.data) {
          logger.info('User has active subscription', { subscription: response.data });
          setShowPackages(false);
        } else {
          logger.info('No active subscription found, will show packages');
          setShowPackages(true);
        }
      } catch (error) {
        logger.error('Error checking subscription', error as Error);
        setShowPackages(true);
      } finally {
        setCheckingSubscription(false);
      }
    };

    checkOnboarding();
  }, [isLoading, isAuthenticated]);

  // Show loader while checking auth or onboarding flag
  if (isLoading || onboardingDone === null) {
    return (
      <Layout style={styles.loaderContainer} level="1">
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.loaderImage}
            resizeMode="contain"
          />
        </View>
        <Spinner size="giant" status="primary" />
        <Text category="h6" style={styles.loaderText}>
          {isDark ? 'Loading...' : 'جاري التحميل...'}
        </Text>
      </Layout>
    );
  }

  // Show onboarding for first-time users (before login)
  if (!onboardingDone) {
    return <OnboardingScreen onFinish={handleOnboardingFinish} />;
  }

  // Show register screen
  if (!isAuthenticated && showRegister) {
    return (
      <RegisterScreen onBackToLogin={() => setShowRegister(false)} />
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLoginSuccess={() => setShowScopeOnboarding(true)}
        onNavigateToRegister={() => setShowRegister(true)}
      />
    );
  }

  // Show scope selection onboarding for logged-in users who haven't chosen scopes
  if (showScopeOnboarding === true) {
    return (
      <OnboardingScreen
        skipToScopes={true}
        onFinish={async (scopes) => {
          await AsyncStorage.setItem('@sign_sa_topics_selected', 'true');
          if (scopes.length > 0) {
            await AsyncStorage.setItem('@sign_sa_onboarding_scopes', JSON.stringify(scopes));
          }
          setShowScopeOnboarding(false);
        }}
      />
    );
  }

  // Show welcome screen after onboarding
  if (showWelcome === true) {
    return (
      <WelcomeMotivationScreen
        onGetStarted={() => {
          setShowWelcome(false);
        }}
      />
    );
  }

  // Show packages screen if no active subscription
  if (showPackages === true) {
    return (
      <PackagesScreen
        onComplete={() => {
          setShowPackages(false);
        }}
      />
    );
  }

  // Show loading while checking subscription
  if (checkingSubscription) {
    return (
      <Layout style={styles.loaderContainer} level="1">
        <Spinner size="giant" />
        <Text category="h6" style={styles.loaderText}>
          {isDark ? 'Checking subscription...' : 'جاري التحقق من الاشتراك...'}
        </Text>
      </Layout>
    );
  }

  // Show main app
  return <AuthenticatedLayout />;
};

// Theme wrapper component - must be used inside ThemeProvider
const ThemedApp = () => {
  const { colorScheme } = useTheme();

  // Merge Eva theme with custom theme based on current theme mode
  const evaTheme = colorScheme === 'dark' ? evaDark : evaLight;
  const theme = { ...evaTheme, ...(colorScheme === 'dark' ? customTheme.dark : customTheme.light) };

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider mapping={mapping} theme={theme}>
        <View style={styles.appContainer}>
          <AppContent />
        </View>
      </ApplicationProvider>
    </>
  );
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'IBMPlexSansArabic-Regular': require('../assets/fonts/IBMPlexSansArabic-Regular.ttf'),
    'IBMPlexSansArabic-Bold': require('../assets/fonts/IBMPlexSansArabic-Bold.ttf'),
    'IBMPlexSansArabic-Medium': require('../assets/fonts/IBMPlexSansArabic-Medium.ttf'),
    'IBMPlexSansArabic-SemiBold': require('../assets/fonts/IBMPlexSansArabic-SemiBold.ttf'),
    'IBMPlexSansArabic-Light': require('../assets/fonts/IBMPlexSansArabic-Light.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Don't render anything until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <LanguageProvider>
          <ThemedApp />
        </LanguageProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  loaderImage: {
    width: 80,
    height: 80,
  },
  loaderText: {
    fontFamily: 'IBMPlexSansArabic-Medium',
    marginTop: 8,
  },
  appContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  contentArea: {
    flex: 1,
  },
});
