import React, { useEffect, useState, useCallback } from 'react';
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
import { SocialFooter } from '@/src/components/SocialFooter';
import { ChatbotFAB } from '@/src/components/ChatbotFAB';
import { COLORS, SPACING, TYPOGRAPHY, ZONES, THEMATIC_CATEGORIES } from '@/src/constants/theme';
import { 
  Plus, Upload, TrendingUp, ChevronDown, ChevronUp, 
  BarChart3, Users, Activity, AlertCircle 
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { diseases, loading: diseasesLoading } = useSelector((state: RootState) => state.diseases);
  const { reports } = useSelector((state: RootState) => state.reports);

  const [refreshing, setRefreshing] = useState(false);
  const [expandedZones, setExpandedZones] = useState<Record<string, boolean>>({});
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    await Promise.all([dispatch(fetchDiseases()), dispatch(fetchApprovedReports())]);
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const toggleZone = (zone: string) => {
    setExpandedZones((prev) => ({ ...prev, [zone]: !prev[zone] }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return COLORS.severityLow;
      case 'medium': return COLORS.severityMedium;
      case 'high': return COLORS.severityHigh;
      case 'critical': return COLORS.severityCritical;
      default: return COLORS.textSecondary;
    }
  };

  const getRecoveryRate = (recovered: number, total: number) => {
    if (total === 0) return 0;
    return ((recovered / total) * 100).toFixed(1);
  };

  const getPositivityRate = (newCases: number, total: number) => {
    if (total === 0) return 0;
    return ((newCases / total) * 100).toFixed(1);
  };

  const getMortalityRate = (deaths: number, total: number) => {
    if (total === 0) return 0;
    return ((deaths / total) * 100).toFixed(1);
  };

  // Analytics calculations
  const totalCases = diseases.reduce((sum: number, d: any) => sum + d.total_cases, 0);
  const totalDeaths = diseases.reduce((sum: number, d: any) => sum + d.mortality, 0);
  const totalRecovered = diseases.reduce((sum: number, d: any) => sum + d.recovered, 0);
  const activeCases = totalCases - totalRecovered - totalDeaths;

  if (diseasesLoading && diseases.length === 0) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => router.push('/')}
        accessibilityLabel="ISMPH Header - Tap logo to go to home"
        accessible={true}
      >
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="ISMPH Logo - Tap to go to home"
          accessible={true}
        />
        <Text style={styles.headerTitle} accessibilityLabel="ISMPH Dashboard">ISMPH Dashboard</Text>
        <Text style={styles.headerSubtitle} accessibilityLabel={`Welcome ${user?.full_name || user?.email || 'User'}`}>
          Welcome, {user?.full_name || user?.email}
        </Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        {/* Analytics Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => setShowAnalytics(!showAnalytics)}
          >
            <View style={styles.sectionTitleRow}>
              <BarChart3 size={24} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Analytics Overview</Text>
            </View>
            {showAnalytics ? <ChevronUp size={20} color={COLORS.text} /> : <ChevronDown size={20} color={COLORS.text} />}
          </TouchableOpacity>

          {showAnalytics && (
            <View style={styles.analyticsGrid}>
              <Card style={styles.analyticsCard} variant="elevated">
                <View style={[styles.analyticsIcon, { backgroundColor: COLORS.info + '20' }]}>
                  <Activity size={24} color={COLORS.info} />
                </View>
                <Text style={styles.analyticsValue}>{totalCases.toLocaleString()}</Text>
                <Text style={styles.analyticsLabel}>Total Cases</Text>
              </Card>

              <Card style={styles.analyticsCard} variant="elevated">
                <View style={[styles.analyticsIcon, { backgroundColor: COLORS.warning + '20' }]}>
                  <AlertCircle size={24} color={COLORS.warning} />
                </View>
                <Text style={styles.analyticsValue}>{activeCases.toLocaleString()}</Text>
                <Text style={styles.analyticsLabel}>Active Cases</Text>
              </Card>

              <Card style={styles.analyticsCard} variant="elevated">
                <View style={[styles.analyticsIcon, { backgroundColor: COLORS.success + '20' }]}>
                  <Users size={24} color={COLORS.success} />
                </View>
                <Text style={styles.analyticsValue}>{totalRecovered.toLocaleString()}</Text>
                <Text style={styles.analyticsLabel}>Recovered</Text>
              </Card>

              <Card style={styles.analyticsCard} variant="elevated">
                <View style={[styles.analyticsIcon, { backgroundColor: COLORS.error + '20' }]}>
                  <AlertCircle size={24} color={COLORS.error} />
                </View>
                <Text style={styles.analyticsValue}>{totalDeaths.toLocaleString()}</Text>
                <Text style={styles.analyticsLabel}>Deaths</Text>
              </Card>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityLabel="Quick Actions section">Quick Actions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
            <Card
              style={styles.actionCard}
              variant="elevated"
              onPress={() => router.push('/reports')}
              accessibilityLabel="Create Report - Submit new PHC report"
              accessible={true}
            >
              <Plus size={32} color={COLORS.primary} />
              <Text style={styles.actionTitle}>Create Report</Text>
              <Text style={styles.actionSubtitle}>Submit new PHC report</Text>
            </Card>

            <Card
              style={styles.actionCard}
              variant="elevated"
              onPress={() => router.push('/reports')}
              accessibilityLabel="Upload Media - Add photos or videos"
              accessible={true}
            >
              <Upload size={32} color={COLORS.secondary} />
              <Text style={styles.actionTitle}>Upload Media</Text>
              <Text style={styles.actionSubtitle}>Add photos or videos</Text>
            </Card>

            <Card
              style={styles.actionCard}
              variant="elevated"
              onPress={() => router.push('/news')}
              accessibilityLabel="Trending News - Latest health updates"
              accessible={true}
            >
              <TrendingUp size={32} color={COLORS.info} />
              <Text style={styles.actionTitle}>Trending News</Text>
              <Text style={styles.actionSubtitle}>Latest health updates</Text>
            </Card>
          </ScrollView>
        </View>


        {/* Thematic Area of Focus */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityLabel="Thematic Area of Focus section">Thematic Area of Focus</Text>
          <Text style={styles.sectionSubtitle} accessibilityLabel="Explore health topics and policies">Explore health topics and policies</Text>
          <View style={styles.categoriesGrid}>
            {THEMATIC_CATEGORIES.map((category) => {
              const getCategoryRoute = (id: string) => {
                const routes: Record<string, string> = {
                  '1': '/categories/rmncah',
                  '2': '/categories/phc',
                  '3': '/categories/swap',
                  '4': '/categories/insurance',
                  '5': '/categories/newborn',
                  '6': '/categories/finance',
                  '7': '/categories/policy',
                  '8': '/categories/accountability',
                };
                return routes[id] || '/';
              };

              return (
                <Card
                  key={category.id}
                  style={styles.categoryCard}
                  variant="outlined"
                  onPress={() => router.push(getCategoryRoute(category.id))}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                    <Text style={styles.categoryEmoji}>{category.icon}</Text>
                  </View>
                  <Text style={styles.categoryName} accessibilityLabel={`Category: ${category.name}`}>{category.name}</Text>
                  <Text style={styles.categoryDescription} numberOfLines={2} accessibilityLabel={`Description: ${category.description}`}>
                    {category.description}
                  </Text>
                </Card>
              );
            })}
          </View>
        </View>

        {/* Policy Commitments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} accessibilityLabel="Policy Commitments section">Policy Commitments</Text>
          <Card style={styles.policyCard} variant="outlined">
            <Badge label="Active" variant="custom" style={{ backgroundColor: COLORS.success }} />
            <Text style={styles.policyTitle} accessibilityLabel="Government Support policy">Government Support</Text>
            <Text style={styles.policyText} accessibilityLabel="Full backing from Ministry of Health for ISMPH initiatives">
              Full backing from Ministry of Health for ISMPH initiatives
            </Text>
          </Card>

          <Card style={styles.policyCard} variant="outlined">
            <Badge label="Funded" variant="custom" style={{ backgroundColor: COLORS.error }} />
            <Text style={styles.policyTitle} accessibilityLabel="Resource Allocation policy">Resource Allocation</Text>
            <Text style={styles.policyText} accessibilityLabel="Dedicated funding for health monitoring systems">Dedicated funding for health monitoring systems</Text>
          </Card>

          <Card style={styles.policyCard} variant="outlined">
            <Badge label="Enacted" variant="custom" style={{ backgroundColor: COLORS.warning }} />
            <Text style={styles.policyTitle} accessibilityLabel="Policy Framework policy">Policy Framework</Text>
            <Text style={styles.policyText} accessibilityLabel="New policies to strengthen disease surveillance">New policies to strengthen disease surveillance</Text>
          </Card>
        </View>

        {/* Recent Reports */}
        {reports.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle} accessibilityLabel="Recent Reports section">Recent Reports</Text>
              <TouchableOpacity onPress={() => router.push('/reports')}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            {reports.slice(0, 3).map((report: any) => (
              <Card key={report.id} style={styles.reportCard} variant="elevated">
                <View style={styles.reportHeader}>
                  <Text style={styles.reportTitle} accessibilityLabel={`Report title: ${report.title}`}>{report.title}</Text>
                  <Badge label={report.priority} type="priority" variant={report.priority} />
                </View>
                <Text style={styles.reportMeta} accessibilityLabel={`Report location and date: ${report.state}, ${new Date(report.created_at).toLocaleDateString()}`}>
                  {report.state} • {new Date(report.created_at).toLocaleDateString()}
                </Text>
                <Text style={styles.reportDescription} numberOfLines={2} accessibilityLabel={`Report description: ${report.description}`}>
                  {report.description}
                </Text>
              </Card>
            ))}
          </View>
        )}

        <SocialFooter />
      </ScrollView>

      <ChatbotFAB />
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
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, marginBottom: SPACING.md },
  sectionSubtitle: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginBottom: SPACING.md, marginTop: -SPACING.sm },
  viewAll: { ...TYPOGRAPHY.body2, color: COLORS.primary, fontWeight: '600' },
  
  // Analytics
  analyticsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  analyticsCard: { flex: 1, minWidth: (width - SPACING.md * 3) / 2, alignItems: 'center', padding: SPACING.md },
  analyticsIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  analyticsValue: { ...TYPOGRAPHY.h2, color: COLORS.text, marginTop: SPACING.xs },
  analyticsLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.xs, textAlign: 'center' },
  
  // Quick Actions
  carousel: { marginHorizontal: -SPACING.md, paddingHorizontal: SPACING.md },
  actionCard: { width: 140, marginRight: SPACING.md, padding: SPACING.md, alignItems: 'center' },
  actionTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', marginTop: SPACING.sm, textAlign: 'center' },
  actionSubtitle: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.xs },
  
  // Disease Tracker
  zoneCard: { marginBottom: SPACING.md },
  zoneHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  zoneHeaderLeft: { flex: 1 },
  zoneTitle: { ...TYPOGRAPHY.h4, color: COLORS.text },
  zoneSubtitle: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.xs },
  diseaseList: { marginTop: SPACING.md },
  diseaseCard: { backgroundColor: COLORS.surface, borderRadius: 8, padding: SPACING.md, marginBottom: SPACING.sm },
  diseaseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  diseaseName: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.text },
  diseaseState: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  severityIndicator: { width: 12, height: 12, borderRadius: 6 },
  diseaseStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  statItem: { alignItems: 'center' },
  statLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  statValue: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.text },
  rateSection: { marginBottom: SPACING.sm },
  rateLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  progressBar: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  
  // Categories
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  categoryCard: { width: (width - SPACING.md * 3) / 2, padding: SPACING.md },
  categoryIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  categoryEmoji: { fontSize: 24 },
  categoryName: { ...TYPOGRAPHY.body2, fontWeight: '600', marginBottom: SPACING.xs },
  categoryDescription: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  
  // Policy
  policyCard: { marginBottom: SPACING.md },
  policyTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', marginTop: SPACING.sm, marginBottom: SPACING.xs },
  policyText: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary },
  
  // Reports
  reportCard: { marginBottom: SPACING.md },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.xs },
  reportTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', flex: 1, marginRight: SPACING.sm },
  reportMeta: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  reportDescription: { ...TYPOGRAPHY.body2, color: COLORS.text },
});
