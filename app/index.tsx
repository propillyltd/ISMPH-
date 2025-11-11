import { useEffect, useState } from 'react';
import { Redirect, usePathname } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { RootState, AppDispatch } from '@/src/store';
import { checkSession } from '@/src/store/slices/authSlice';
import { COLORS } from '@/src/constants/theme';

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [isChecking, setIsChecking] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Check for existing session on app start
    const checkExistingSession = async () => {
      try {
        await dispatch(checkSession()).unwrap();
      } catch (error) {
        console.log('No existing session found');
      } finally {
        setIsChecking(false);
      }
    };

    checkExistingSession();
  }, [dispatch]);

  // Handle deep linking and direct URL access
  useEffect(() => {
    if (!isChecking && isAuthenticated && pathname) {
      // If user is authenticated and accessing a deep link,
      // ensure they get redirected to the appropriate section
      const isAdminRoute = pathname.startsWith('/admin');
      const isAuthRoute = pathname.startsWith('/auth');
      const isPublicRoute = ['/', '/forgot-password', '/settings'].includes(pathname);

      if (isAuthRoute && isAuthenticated) {
        // Redirect authenticated users away from auth pages
        return;
      }

      if (isAdminRoute && user?.role !== 'admin' && user?.role !== 'super_admin') {
        // Redirect non-admin users away from admin routes
        return;
      }
    }
  }, [isChecking, isAuthenticated, pathname, user]);

  // Show loading while checking session
  if (isChecking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  // Redirect admin users to admin dashboard
  if (user?.role === 'admin' || user?.role === 'super_admin') {
    return <Redirect href="/admin/index" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});
