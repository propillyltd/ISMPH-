import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Card } from '@/src/components/Card';
import { Badge } from '@/src/components/Badge';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import { Search, Share2 } from 'lucide-react-native';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  date: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  type: 'news' | 'report';
}

const DEMO_NEWS: NewsArticle[] = [
  // Kaduna News from Excel
  {
    id: 'kaduna-1',
    title: 'Kaduna Govt Moves to Recruit 1800 Health Workers',
    description: 'Kaduna State Government announces plans to recruit 1800 additional health workers to strengthen healthcare delivery.',
    source: 'TGNews',
    date: '2025-05-01',
    category: 'PHC Agenda',
    priority: 'high',
    type: 'news',
  },
  {
    id: 'kaduna-2',
    title: 'ISMPH Trains Kaduna Journalists on Health Reporting',
    description: 'Capacity building workshop for journalists to improve health reporting and advocacy.',
    source: 'Vanguard',
    date: '2025-05-01',
    category: 'Capacity Building',
    priority: 'medium',
    type: 'news',
  },
  {
    id: 'kaduna-3',
    title: 'Kaduna Govt Targets 2.8M Children for Azithromycin Administration',
    description: 'Mass drug administration program to combat infectious diseases in Kaduna State.',
    source: 'The Sun',
    date: '2025-05-01',
    category: 'RMNCAH',
    priority: 'high',
    type: 'news',
  },
  {
    id: 'kaduna-4',
    title: 'Kaduna UNICF Partnership Drives Mobile Health Services',
    description: 'Mobile health services reach remote communities through UNICF partnership.',
    source: 'Newsweb Express',
    date: '2025-05-01',
    category: 'Other Health Report',
    priority: 'medium',
    type: 'news',
  },
  {
    id: 'kaduna-5',
    title: 'Kaduna Targets Informal Sector for Health Insurance',
    description: 'New drive to enroll informal sector workers into contributory health scheme.',
    source: 'Newsweb Express',
    date: '2025-05-01',
    category: 'Contributory Health Insurance',
    priority: 'medium',
    type: 'news',
  },
  {
    id: 'kaduna-6',
    title: 'Stakeholders Mobilise LGA Chairmen Spouses to Boost PHC Services',
    description: 'Wives of LGA chairmen empowered to champion uptake of primary healthcare services.',
    source: 'VON',
    date: '2025-05-01',
    category: 'PHC Agenda',
    priority: 'medium',
    type: 'news',
  },
  {
    id: 'kaduna-7',
    title: 'SCI to Provide Healthcare Support for 1000 Children with Disabilities',
    description: 'Specialized healthcare support for children with disabilities under ROOSC project.',
    source: 'Newsweb Express',
    date: '2025-05-01',
    category: 'Other Health Report',
    priority: 'medium',
    type: 'news',
  },
  {
    id: 'kaduna-8',
    title: 'Alive Thrive Kaduna Govt Boost Support for MMS Logistics Supply',
    description: 'Enhanced support for maternal, newborn and child health logistics.',
    source: 'The News Icon',
    date: '2025-06-01',
    category: 'RMNCAH+N',
    priority: 'medium',
    type: 'news',
  },
  {
    id: 'kaduna-9',
    title: 'Kaduna Govt Targets Return of 100,000 Out-of-School Children',
    description: 'Comprehensive program to return out-of-school children to education.',
    source: 'Vanguard',
    date: '2025-06-01',
    category: 'Other Health Report',
    priority: 'high',
    type: 'news',
  },
  {
    id: 'kaduna-10',
    title: 'Gavi Pledges 3 Million to Boost Immunization in Kaduna State',
    description: 'International support to strengthen routine immunization and primary healthcare.',
    source: 'Newsweb Express',
    date: '2025-08-01',
    category: 'RMNCAH+N',
    priority: 'high',
    type: 'news',
  },

  // Kano News from Excel
  {
    id: 'kano-1',
    title: 'ISMPH Organizes Training for Kano Journalists on Maternal Mortality Reduction',
    description: 'Capacity building workshop to improve maternal health reporting in Kano.',
    source: 'Pyramid Radio',
    date: '2025-05-01',
    category: 'Capacity Building',
    priority: 'medium',
    type: 'news',
  },
  {
    id: 'kano-2',
    title: 'Kano Govt Commits to 24/7 Health Services in All 484 Wards',
    description: 'State government ensures round-the-clock healthcare services across all wards.',
    source: 'Nigerian Info',
    date: '2025-05-01',
    category: 'PHC Agenda',
    priority: 'high',
    type: 'news',
  },
  {
    id: 'kano-3',
    title: 'Kano Govt Unveils Bold Healthcare Reforms',
    description: 'Comprehensive healthcare reforms to improve service delivery in Kano State.',
    source: 'KSCHMA',
    date: '2025-05-01',
    category: 'Contributory Health Insurance',
    priority: 'high',
    type: 'news',
  },
  {
    id: 'kano-4',
    title: 'Kano Govt Renames Over 200 PHCs Across the State',
    description: 'Renaming and renovation of primary healthcare centers to improve service delivery.',
    source: 'Radio Kano',
    date: '2025-05-01',
    category: 'PHC Agenda',
    priority: 'medium',
    type: 'news',
  },
  {
    id: 'kano-5',
    title: 'Kano Govt Provides Free Check-up for World Hypertension Day',
    description: 'Free health screening and check-ups across Kano facilities.',
    source: 'Pyramid Radio',
    date: '2025-05-01',
    category: 'Other Health Report',
    priority: 'medium',
    type: 'news',
  },
  {
    id: 'kano-6',
    title: 'Kano Govt Develops Strategic Communication Blueprint for Maternal Health',
    description: 'New communication strategy to boost maternal and child health outcomes.',
    source: 'Pyramid Radio',
    date: '2025-07-01',
    category: 'RMNCAH',
    priority: 'medium',
    type: 'news',
  },
  {
    id: 'kano-7',
    title: 'Kano Health Ministry Partners with KNHA, EngenderHealth, LISDEL',
    description: 'Multi-stakeholder partnership to improve primary healthcare delivery.',
    source: 'Prime Times News',
    date: '2025-07-01',
    category: 'PHC Agenda',
    priority: 'high',
    type: 'news',
  },
  {
    id: 'kano-8',
    title: 'Governor Yusuf Approves Foreign Training for Kano Nurses and Doctors',
    description: 'Masters program training abroad for Kano healthcare workers.',
    source: 'Global Tracker',
    date: '2025-07-01',
    category: 'Capacity Building',
    priority: 'high',
    type: 'news',
  },
  {
    id: 'kano-9',
    title: 'Kano Govt Launches Measles-Rubella Vaccination Campaign',
    description: 'Mass vaccination campaign targeting 7.8 million children.',
    source: 'Prime Time News',
    date: '2025-10-01',
    category: 'Immunization',
    priority: 'high',
    type: 'news',
  },
  {
    id: 'kano-10',
    title: 'Kano Govt Launches Free Maternity AE Commodities Distribution',
    description: 'Monthly distribution of free maternity and antenatal care commodities.',
    source: 'Pyramid Radio',
    date: '2025-10-01',
    category: 'RMNCAH',
    priority: 'medium',
    type: 'news',
  },

  // Lagos News from Excel
  {
    id: 'lagos-1',
    title: 'ISMPH-EngenderHealth Consortium Partner Lagos State to Train Journalists',
    description: 'Media training program to improve health reporting and advocacy in Lagos.',
    source: 'Smartview Magazine',
    date: '2025-06-01',
    category: 'Capacity Building',
    priority: 'medium',
    type: 'news',
  },
  {
    id: 'lagos-2',
    title: 'Lagos Govt Reaffirms Drive Toward Universal Health Coverage',
    description: 'Continued commitment to Ilera Eko health insurance scheme expansion.',
    source: 'Bond FM',
    date: '2025-06-01',
    category: 'Contributory Health Insurance',
    priority: 'high',
    type: 'news',
  },
  {
    id: 'lagos-3',
    title: 'Experts Urge Responsible Storytelling to Aid Public Health Outcomes',
    description: 'Media professionals trained on ethical health reporting practices.',
    source: 'Guardian Newspaper',
    date: '2025-06-01',
    category: 'Capacity Building',
    priority: 'medium',
    type: 'news',
  },
  {
    id: 'lagos-4',
    title: 'Lagos Launches Strategic Health Planning Workshop',
    description: 'SWAp initiative workshop to strengthen health system reform and budgeting.',
    source: 'Daily Independent',
    date: '2025-07-01',
    category: 'SWAp Unit Activity',
    priority: 'high',
    type: 'news',
  },
  {
    id: 'lagos-5',
    title: 'Lagos Begins Implementation of SWAp Initiative',
    description: 'Sector-wide approach to strengthen health system performance.',
    source: 'Punch Newspaper',
    date: '2025-07-01',
    category: 'SWAp Unit Activity',
    priority: 'high',
    type: 'news',
  },
  {
    id: 'lagos-6',
    title: 'LASAM Consortium Partners Deliberate on Efficient PHC Delivery',
    description: 'Stakeholder meeting to improve primary healthcare accountability.',
    source: 'Thisday Newspaper',
    date: '2025-08-01',
    category: 'Accountability Meeting',
    priority: 'medium',
    type: 'news',
  },
  {
    id: 'lagos-7',
    title: 'Traditional Media Urged to Drive Maternal Healthcare Reform',
    description: 'Capacity building for traditional media influencers on maternal health.',
    source: 'Daily Independent',
    date: '2025-08-01',
    category: 'Capacity Building',
    priority: 'medium',
    type: 'news',
  },
  {
    id: 'lagos-8',
    title: 'EngenderHealth-Led Consortium Mobilises PHC Stakeholders',
    description: 'Co-creation meeting with PHCB to strengthen Lagos primary healthcare.',
    source: 'The Media Views',
    date: '2025-09-01',
    category: 'Co-creation Meeting',
    priority: 'high',
    type: 'news',
  },
  {
    id: 'lagos-9',
    title: 'Stakeholders Seek Urgent Action to Halt Crisis in Councils PHC',
    description: 'Review meeting addresses gaps in primary healthcare funding and infrastructure.',
    source: 'Guardian Newspaper',
    date: '2025-09-01',
    category: 'Review Meeting',
    priority: 'high',
    type: 'news',
  },
  {
    id: 'lagos-10',
    title: 'Debunking the Myths: Lagos Champions Family Planning',
    description: 'Alliance meeting for CSOs and stakeholders on family planning advocacy.',
    source: 'New Telegraph',
    date: '2025-09-01',
    category: 'Alliance Meeting',
    priority: 'medium',
    type: 'news',
  },
];

const CATEGORIES = [
  'All',
  'RMNCAH',
  'RMNCAH+N',
  'Contributory Health Insurance',
  'PHC Agenda',
  'Capacity Building',
  'Other Health Report',
  'SWAp Unit Activity',
  'Accountability Meeting',
  'Co-creation Meeting',
  'Review Meeting',
  'Alliance Meeting',
  'Immunization'
];

export default function NewsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredNews = DEMO_NEWS.filter((article) => {
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesPriority = selectedPriority === 'All' || article.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return COLORS.priorityHigh;
      case 'medium': return COLORS.priorityMedium;
      case 'low': return COLORS.priorityLow;
      default: return COLORS.textSecondary;
    }
  };

  const renderNewsItem = ({ item }: { item: NewsArticle }) => (
    <Card
      style={styles.newsCard}
      variant="elevated"
      onPress={() => router.push(`/news/${item.id}`)}
    >
      <View style={styles.newsHeader}>
        <Badge label={item.priority.toUpperCase()} variant={item.priority} type="priority" />
        <TouchableOpacity>
          <Share2 size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsDescription} numberOfLines={3}>{item.description}</Text>
      <View style={styles.newsFooter}>
        <View style={styles.newsMetaLeft}>
          <Text style={styles.newsSource}>{item.source}</Text>
          <Text style={styles.newsDivider}>•</Text>
          <Text style={styles.newsDate}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: getPriorityColor(item.priority) + '20' }]}>
          <Text style={[styles.categoryText, { color: getPriorityColor(item.priority) }]}>
            {item.category}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Media Reports</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search news..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryChip, selectedCategory === category && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.categoryChipText, selectedCategory === category && styles.categoryChipTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.priorityFilter}>
          {['All', 'high', 'medium', 'low'].map((priority) => (
            <TouchableOpacity
              key={priority}
              style={[styles.priorityChip, selectedPriority === priority && styles.priorityChipActive]}
              onPress={() => setSelectedPriority(priority)}
            >
              <Text style={[styles.priorityChipText, selectedPriority === priority && styles.priorityChipTextActive]}>
                {priority === 'All' ? 'All' : priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredNews}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.newsList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: SPACING.lg, paddingTop: SPACING.xl + 20, alignItems: 'center' },
  logo: { width: 60, height: 60, marginBottom: SPACING.sm },
  headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.white },
  searchSection: { backgroundColor: COLORS.white, padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 8, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, marginBottom: SPACING.sm },
  searchInput: { flex: 1, marginLeft: SPACING.sm, ...TYPOGRAPHY.body1, color: COLORS.text },
  categoryScroll: { marginBottom: SPACING.sm },
  categoryChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 20, backgroundColor: COLORS.surface, marginRight: SPACING.sm },
  categoryChipActive: { backgroundColor: COLORS.primary },
  categoryChipText: { ...TYPOGRAPHY.body2, color: COLORS.text },
  categoryChipTextActive: { color: COLORS.white, fontWeight: '600' },
  priorityFilter: { flexDirection: 'row', gap: SPACING.sm },
  priorityChip: { flex: 1, paddingVertical: SPACING.xs, borderRadius: 8, backgroundColor: COLORS.surface, alignItems: 'center' },
  priorityChipActive: { backgroundColor: COLORS.primary },
  priorityChipText: { ...TYPOGRAPHY.caption, color: COLORS.text, fontWeight: '600' },
  priorityChipTextActive: { color: COLORS.white },
  newsList: { padding: SPACING.md },
  newsCard: { marginBottom: SPACING.md },
  newsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  newsTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: SPACING.xs },
  newsDescription: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  newsFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.xs },
  newsMetaLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  newsSource: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, fontWeight: '600' },
  newsDivider: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginHorizontal: SPACING.xs },
  newsDate: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  categoryBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: 8 },
  categoryText: { ...TYPOGRAPHY.caption, fontWeight: '600' },
});
