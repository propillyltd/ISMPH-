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

  const loadData = async () => {
    await Promise.all([dispatch(fetchDiseases()), dispatch(fetchApprovedReports())]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

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
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>ISMPH Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome, {user?.full_name || user?.email}</Text>
      </View>

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
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
            <Card style={styles.actionCard} variant="elevated" onPress={() => router.push('/reports')}>
              <Plus size={32} color={COLORS.primary} />
              <Text style={styles.actionTitle}>Create Report</Text>
              <Text style={styles.actionSubtitle}>Submit new PHC report</Text>
            </Card>

            <Card style={styles.actionCard} variant="elevated" onPress={() => router.push('/reports')}>
              <Upload size={32} color={COLORS.secondary} />
              <Text style={styles.actionTitle}>Upload Media</Text>
              <Text style={styles.actionSubtitle}>Add photos or videos</Text>
            </Card>

            <Card style={styles.actionCard} variant="elevated" onPress={() => router.push('/news')}>
              <TrendingUp size={32} color={COLORS.info} />
              <Text style={styles.actionTitle}>Trending News</Text>
              <Text style={styles.actionSubtitle}>Latest health updates</Text>
            </Card>
          </ScrollView>
        </View>

        {/* Disease Tracker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disease Tracker</Text>
          {ZONES.map((zone: string) => {
            const zoneDiseases = diseases.filter((d: any) => d.zone === zone);
            if (zoneDiseases.length === 0) return null;

            return (
              <Card key={zone} style={styles.zoneCard} variant="outlined">
                <TouchableOpacity style={styles.zoneHeader} onPress={() => toggleZone(zone)}>
                  <View style={styles.zoneHeaderLeft}>
                    <Text style={styles.zoneTitle}>{zone}</Text>
                    <Text style={styles.zoneSubtitle}>{zoneDiseases.length} diseases tracked</Text>
                  </View>
                  {expandedZones[zone] ? (
                    <ChevronUp size={24} color={COLORS.textSecondary} />
                  ) : (
                    <ChevronDown size={24} color={COLORS.textSecondary} />
                  )}
                </TouchableOpacity>

                {expandedZones[zone] && (
                  <View style={styles.diseaseList}>
                    {zoneDiseases.map((disease: any) => (
                      <View key={disease.id} style={styles.diseaseCard}>
                        <View style={styles.diseaseHeader}>
                          <Text style={styles.diseaseName}>{disease.disease_name}</Text>
                          <View
                            style={[
                              styles.severityIndicator,
                              { backgroundColor: getSeverityColor(disease.severity) },
                            ]}
                          />
                        </View>
                        <Text style={styles.diseaseState}>{disease.state}</Text>

                        <View style={styles.diseaseStats}>
                          <View style={styles.statItem}>
                            <Text style={styles.statLabel}>New</Text>
                            <Text style={[styles.statValue, { color: COLORS.warning }]}>
                              +{disease.new_cases}
                            </Text>
                          </View>
                          <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Total</Text>
                            <Text style={styles.statValue}>{disease.total_cases}</Text>
                          </View>
                          <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Deaths</Text>
                            <Text style={[styles.statValue, { color: COLORS.error }]}>
                              {disease.mortality}
                            </Text>
                          </View>
                          <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Recovered</Text>
                            <Text style={[styles.statValue, { color: COLORS.success }]}>
                              {disease.recovered}
                            </Text>
                          </View>
                        </View>

                        {/* Recovery Rate Bar */}
                        <View style={styles.rateSection}>
                          <Text style={styles.rateLabel}>Recovery Rate: {getRecoveryRate(disease.recovered, disease.total_cases)}%</Text>
                          <View style={styles.progressBar}>
                            <View
                              style={{
                                height: '100%',
                                width: getRecoveryRate(disease.recovered, disease.total_cases) + '%' as any,
                                backgroundColor: COLORS.success,
                                borderRadius: 3,
                              }}
                            />
                          </View>
                        </View>

                        {/* Mortality Rate Bar */}
                        <View style={styles.rateSection}>
                          <Text style={styles.rateLabel}>Mortality Rate: {getMortalityRate(disease.mortality, disease.total_cases)}%</Text>
                          <View style={styles.progressBar}>
                            <View
                              style={{
                                height: '100%',
                                width: getMortalityRate(disease.mortality, disease.total_cases) + '%' as any,
                                backgroundColor: COLORS.error,
                                borderRadius: 3,
                              }}
                            />
                          </View>
                        </View>

                        {/* Positivity Rate Bar */}
                        <View style={styles.rateSection}>
                          <Text style={styles.rateLabel}>Positivity Rate: {getPositivityRate(disease.new_cases, disease.total_cases)}%</Text>
                          <View style={styles.progressBar}>
                            <View
                              style={{
                                height: '100%',
                                width: getPositivityRate(disease.new_cases, disease.total_cases) + '%' as any,
                                backgroundColor: COLORS.warning,
                                borderRadius: 3,
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </Card>
            );
          })}
        </View>

        {/* Thematic Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thematic Categories</Text>
          <Text style={styles.sectionSubtitle}>Explore health topics and policies</Text>
          <View style={styles.categoriesGrid}>
            {THEMATIC_CATEGORIES.map((category) => (
              <Card key={category.id} style={styles.categoryCard} variant="outlined">
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <Text style={styles.categoryEmoji}>{category.icon}</Text>
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDescription} numberOfLines={2}>
                  {category.description}
                </Text>
              </Card>
            ))}
          </View>
        </View>

        {/* Policy Commitments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Policy Commitments</Text>
          <Card style={styles.policyCard} variant="outlined">
            <Badge label="Active" variant="custom" style={{ backgroundColor: COLORS.success }} />
            <Text style={styles.policyTitle}>Government Support</Text>
            <Text style={styles.policyText}>
              Full backing from Ministry of Health for ISMPH initiatives
            </Text>
          </Card>

          <Card style={styles.policyCard} variant="outlined">
            <Badge label="Funded" variant="custom" style={{ backgroundColor: COLORS.error }} />
            <Text style={styles.policyTitle}>Resource Allocation</Text>
            <Text style={styles.policyText}>Dedicated funding for health monitoring systems</Text>
          </Card>

          <Card style={styles.policyCard} variant="outlined">
            <Badge label="Enacted" variant="custom" style={{ backgroundColor: COLORS.warning }} />
            <Text style={styles.policyTitle}>Policy Framework</Text>
            <Text style={styles.policyText}>New policies to strengthen disease surveillance</Text>
          </Card>
        </View>

        {/* Recent Reports */}
        {reports.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Reports</Text>
              <TouchableOpacity onPress={() => router.push('/reports')}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            {reports.slice(0, 3).map((report: any) => (
              <Card key={report.id} style={styles.reportCard} variant="elevated">
                <View style={styles.reportHeader}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <Badge label={report.priority} type="priority" variant={report.priority} />
                </View>
                <Text style={styles.reportMeta}>
                  {report.state} • {new Date(report.created_at).toLocaleDateString()}
                </Text>
                <Text style={styles.reportDescription} numberOfLines={2}>
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
