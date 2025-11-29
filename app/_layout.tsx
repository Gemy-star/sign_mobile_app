import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import LoginScreen from '@/screens/LoginScreen';
import WelcomeMotivationScreen from '@/screens/WelcomeMotivationScreen';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

const AuthenticatedLayout = () => {
  const { isVisible } = useSidebar();

  return (
    <View style={styles.contentArea}>
      <Header />
      {isVisible ? <Sidebar /> : <Stack screenOptions={{ headerShown: false }} />}
    </View>
  );
};

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && !showWelcome) {
      setShowWelcome(true);
    }
  }, [isLoading, isAuthenticated]);

  // Show loader while checking auth
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <Image
          source={require('../assets/images/loader.png')}
          style={styles.loaderImage}
          resizeMode="contain"
        />
      </View>
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
  if (showWelcome) {
    return (
      <WelcomeMotivationScreen
        onGetStarted={() => {
          setShowWelcome(false);
          router.replace('/(tabs)');
        }}
      />
    );
  }

  // Show main app
  return <AuthenticatedLayout />;
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'IBM Plex Sans Arabic': require('../assets/fonts/IBMPlexSansArabic-Regular.ttf'),
    'IBM Plex Sans Arabic Bold': require('../assets/fonts/IBMPlexSansArabic-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <Image
          source={require('../assets/images/loader.png')}
          style={styles.loaderImage}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <SidebarProvider>
            <LoadingProvider>
              <View style={styles.appContainer}>
                <AppContent />
              </View>
            </LoadingProvider>
          </SidebarProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loaderImage: {
    width: 150,
    height: 150,
  },
  appContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  contentArea: {
    flex: 1,
  },
});
