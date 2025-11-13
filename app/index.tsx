import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';

export default function Index() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  // Redirect admin users to admin dashboard
  if (user?.role === 'admin') {
    return <Redirect href="/admin/index" />;
  }

  return <Redirect href="/(tabs)" />;
}
