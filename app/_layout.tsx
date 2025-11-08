import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { store } from '@/src/store';
import { checkSession } from '@/src/store/slices/authSlice';

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    // Check for existing session on app start
    store.dispatch(checkSession()).catch((error) => {
      console.error('Session check failed:', error);
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
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
      </Provider>
    </GestureHandlerRootView>
  );
}
