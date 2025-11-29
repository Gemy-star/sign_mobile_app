import { customTheme } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import LoginScreen from '@/screens/LoginScreen';
import WelcomeMotivationScreen from '@/screens/WelcomeMotivationScreen';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout, Spinner, Text } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

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
  const { isAuthenticated, isLoading } = useAuth();
  const { colorScheme } = useTheme();
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);

  const isDark = colorScheme === 'dark';

  useEffect(() => {
    if (!isLoading && isAuthenticated && showWelcome === null) {
      setShowWelcome(true);
    }
  }, [isLoading, isAuthenticated]);

  // Show loader while checking auth
  if (isLoading) {
    return (
      <Layout style={styles.loaderContainer} level="1">
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/loader.png')}
            style={styles.loaderImage}
            resizeMode="contain"
          />
        </View>
        <Spinner size="giant" />
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
          setShowWelcome(true);
        }}
      />
    );
  }

  // Show welcome screen after login
  if (showWelcome === true) {
    return (
      <WelcomeMotivationScreen
        onGetStarted={() => {
          setShowWelcome(false);
        }}
      />
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
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <LoadingProvider>
            <ThemedApp />
          </LoadingProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
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
