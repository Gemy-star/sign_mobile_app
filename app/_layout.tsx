import { customTheme } from '@/constants/theme';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { useAuthActions, useAuthState } from '@/hooks/useAuth';
import AllSetScreen from '@/screens/AllSetScreen';
import FindingTopicsScreen from '@/screens/FindingTopicsScreen';
import LoginScreen from '@/screens/LoginScreen';
import PackagesScreen from '@/screens/PackagesScreen';
import TopicSelectionScreen from '@/screens/TopicSelectionScreen';
import WelcomeMotivationScreen from '@/screens/WelcomeMotivationScreen';
import { apiClient } from '@/services/api.client';
import { dataSource } from '@/services/dataSource.service';
import { store } from '@/store';
import { logger } from '@/utils/logger';
import * as eva from '@eva-design/eva';
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

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuthState();
  const { checkAuth } = useAuthActions();
  const { colorScheme } = useTheme();
  const { language } = useLanguage();
  const [showTopicSelection, setShowTopicSelection] = useState<boolean | null>(null);
  const [showFindingTopics, setShowFindingTopics] = useState(false);
  const [showAllSet, setShowAllSet] = useState(false);
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);
  const [showPackages, setShowPackages] = useState<boolean | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(false);

  const isDark = colorScheme === 'dark';

  // Update API client language when language changes
  useEffect(() => {
    apiClient.setLanguage(language);
  }, [language]);

  useEffect(() => {
    // Check if user is already logged in on mount
    checkAuth();
  }, []);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!isLoading && isAuthenticated && showTopicSelection === null) {
        // Check if user has completed topic selection
        // For now, always show it on first login
        // In production, you'd check localStorage or user preferences
        const hasCompletedTopicSelection = false; // await AsyncStorage.getItem('topicsSelected');

        if (!hasCompletedTopicSelection) {
          setShowTopicSelection(true);
        } else {
          setShowWelcome(true);
          checkSubscription();
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

  // Show loader while checking auth
  if (isLoading) {
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

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLoginSuccess={() => {
          setShowTopicSelection(true);
        }}
      />
    );
  }

  // Show topic selection first
  if (showTopicSelection === true) {
    return (
      <TopicSelectionScreen
        onComplete={(topics) => {
          // Save topics to user preferences
          // await AsyncStorage.setItem('topicsSelected', 'true');
          // await AsyncStorage.setItem('selectedTopics', JSON.stringify(topics));
          setShowTopicSelection(false);
          setShowFindingTopics(true);
        }}
      />
    );
  }

  // Show finding topics loading screen
  if (showFindingTopics) {
    return (
      <FindingTopicsScreen
        onComplete={() => {
          setShowFindingTopics(false);
          setShowAllSet(true);
        }}
      />
    );
  }

  // Show all set screen
  if (showAllSet) {
    return (
      <AllSetScreen
        onComplete={() => {
          setShowAllSet(false);
          setShowWelcome(true);
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
  const theme = colorScheme === 'dark'
    ? { ...eva.dark, ...customTheme.dark }
    : { ...eva.light, ...customTheme.light };

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={theme}>
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
