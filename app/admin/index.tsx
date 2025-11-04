import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { RootState, AppDispatch } from '@/src/store';
import { fetchDiseases } from '@/src/store/slices/diseasesSlice';
import { fetchApprovedReports } from '@/src/store/slices/reportsSlice';
import { Card } from '@/src/components/Card';
import { Badge } from '@/src/components/Badge';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { COLORS, SPACING, TYPOGRAPHY, ZONES } from '@/src/constants/theme';
import {
  BarChart3,
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Activity,
  AlertCircle,
  Settings,
  ChevronRight,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { diseases, loading: diseasesLoading } = useSelector((state: RootState) => state.diseases);
  const { reports } = useSelector((state: RootState) => state.reports);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([dispatch(fetchDiseases()), dispatch(fetchApprovedReports())]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Analytics calculations
  const totalCases = diseases.reduce((sum: number, d: any) => sum + d.total_cases, 0);
  const totalDeaths = diseases.reduce((sum: number, d: any) => sum + d.mortality, 0);
  const totalRecovered = diseases.reduce((sum: number, d: any) => sum + d.recovered, 0);
  const activeCases = totalCases - totalRecovered - totalDeaths;

  // Mock admin stats
  const adminStats = {
    totalUsers: 1247,
    totalReports: 89,
    pendingReports: 23,
    resolvedFeedback: 156,
    criticalAlerts: 3,
  };

  if (diseasesLoading && diseases.length === 0) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }

  const adminMenuItems = [
    {
      id: 'analytics',
      title: 'Analytics Dashboard',
      subtitle: 'View detailed analytics and trends',
      icon: BarChart3,
      color: COLORS.primary,
      route: '/admin/analytics',
    },
    {
      id: 'reports',
      title: 'Manage Reports',
      subtitle: `${adminStats.pendingReports} reports pending approval`,
      icon: FileText,
      color: COLORS.warning,
      route: '/admin/reports',
    },
    {
      id: 'feedback',
      title: 'Handle Feedback',
      subtitle: `${adminStats.criticalAlerts} critical alerts require attention`,
      icon: MessageSquare,
      color: COLORS.error,
      route: '/admin/feedback',
    },
    {
      id: 'users',
      title: 'User Management',
      subtitle: `${adminStats.totalUsers} registered users`,
      icon: Users,
      color: COLORS.info,
      route: '/admin/users',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome back, {user?.full_name}</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Overview</Text>
          <View style={styles.statsGrid}>
            <Card style={styles.statCard} variant="elevated">
              <View style={[styles.statIcon, { backgroundColor: COLORS.primary + '20' }]}>
                <Users size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.statValue}>{adminStats.totalUsers.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </Card>

            <Card style={styles.statCard} variant="elevated">
              <View style={[styles.statIcon, { backgroundColor: COLORS.warning + '20' }]}>
                <FileText size={24} color={COLORS.warning} />
              </View>
              <Text style={styles.statValue}>{adminStats.pendingReports}</Text>
              <Text style={styles.statLabel}>Pending Reports</Text>
            </Card>

            <Card style={styles.statCard} variant="elevated">
              <View style={[styles.statIcon, { backgroundColor: COLORS.error + '20' }]}>
                <AlertCircle size={24} color={COLORS.error} />
              </View>
              <Text style={styles.statValue}>{adminStats.criticalAlerts}</Text>
              <Text style={styles.statLabel}>Critical Alerts</Text>
            </Card>

            <Card style={styles.statCard} variant="elevated">
              <View style={[styles.statIcon, { backgroundColor: COLORS.success + '20' }]}>
                <Activity size={24} color={COLORS.success} />
              </View>
              <Text style={styles.statValue}>{totalCases.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Active Cases</Text>
            </Card>
          </View>
        </View>

        {/* Admin Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Administration</Text>
          {adminMenuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => router.push(item.route)}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                  <item.icon size={24} color={item.color} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <ChevronRight size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Card style={styles.activityCard} variant="outlined">
            <View style={styles.activityItem}>
              <Badge label="Report" variant="custom" style={{ backgroundColor: COLORS.warning }} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New report submitted</Text>
                <Text style={styles.activityMeta}>Equipment shortage at Ikeja PHC • 2 hours ago</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.activityCard} variant="outlined">
            <View style={styles.activityItem}>
              <Badge label="Feedback" variant="custom" style={{ backgroundColor: COLORS.error }} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Critical feedback received</Text>
                <Text style={styles.activityMeta}>Long wait times at Victoria Island • 4 hours ago</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.activityCard} variant="outlined">
            <View style={styles.activityItem}>
              <Badge label="User" variant="custom" style={{ backgroundColor: COLORS.success }} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New user registered</Text>
                <Text style={styles.activityMeta}>Staff account from Kano • 6 hours ago</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: SPACING.lg, paddingTop: SPACING.xl + 20, alignItems: 'center' },
  logo: { width: 80, height: 80, marginBottom: SPACING.sm },
  headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.white },
  headerSubtitle: { ...TYPOGRAPHY.body2, color: COLORS.white, opacity: 0.9, marginTop: SPACING.xs },
  content: { flex: 1 },
  section: { padding: SPACING.md },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, marginBottom: SPACING.md },

  // Stats
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  statCard: { flex: 1, minWidth: (width - SPACING.md * 3) / 2, alignItems: 'center', padding: SPACING.md },
  statIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  statValue: { ...TYPOGRAPHY.h2, color: COLORS.text, marginTop: SPACING.xs },
  statLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.xs, textAlign: 'center' },

  // Menu
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: 8, marginBottom: SPACING.sm },
  menuLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  menuIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  menuContent: { flex: 1 },
  menuTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  menuSubtitle: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },

  // Activity
  activityCard: { marginBottom: SPACING.sm },
  activityItem: { flexDirection: 'row', alignItems: 'flex-start' },
  activityContent: { flex: 1, marginLeft: SPACING.sm },
  activityTitle: { ...TYPOGRAPHY.body2, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  activityMeta: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
});