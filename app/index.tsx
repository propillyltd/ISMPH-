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
    console.log('🔍 Index: Starting session check...');
    // Check for existing session on app start
    const checkExistingSession = async () => {
      try {
        console.log('🔍 Index: Dispatching checkSession...');
        await dispatch(checkSession()).unwrap();
        console.log('✅ Index: Session check successful');
      } catch (error) {
        console.log('❌ Index: Session check failed:', error);
      } finally {
        console.log('🔍 Index: Setting isChecking to false');
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

  console.log('🔍 Index render: isChecking:', isChecking, 'isAuthenticated:', isAuthenticated, 'user:', user);

  // Show loading while checking session
  if (isChecking) {
    console.log('🔍 Index: Showing loading spinner');
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    console.log('🔍 Index: Redirecting to /auth');
    return <Redirect href="/auth" />;
  }

  // Redirect admin users to admin dashboard
  if (user?.role === 'admin' || user?.role === 'super_admin') {
    console.log('🔍 Index: Redirecting admin to /admin');
    return <Redirect href="/admin" />;
  }

  console.log('🔍 Index: Redirecting to /(tabs)');
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
