import { useEffect } from 'react';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { store } from '@/src/store';
import { LanguageProvider } from '@/src/contexts/LanguageContext';

export default function RootLayout() {
  useFrameworkReady();

  // Handle deep linking and web refresh issues
  useEffect(() => {
    // For web builds, ensure proper handling of direct URL access
    if (typeof window !== 'undefined') {
      // Handle browser back/forward navigation
      const handleNavigation = () => {
        // Force re-render on navigation changes
        window.dispatchEvent(new Event('popstate'));
      };

      window.addEventListener('popstate', handleNavigation);

      return () => {
        window.removeEventListener('popstate', handleNavigation);
      };
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <LanguageProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="categories" />
            <Stack.Screen name="admin" />
            <Stack.Screen name="news" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="forgot-password" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
          <Toast />
        </LanguageProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
