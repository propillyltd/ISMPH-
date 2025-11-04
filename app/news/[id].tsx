import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Card } from '@/src/components/Card';
import { Badge } from '@/src/components/Badge';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import { ArrowLeft, Share2, Calendar, Tag } from 'lucide-react-native';

const NEWS_DATA: any = {
  'kaduna-1': {
    id: 'kaduna-1',
    title: 'Kaduna Govt Moves to Recruit 1800 Health Workers',
    description: 'Kaduna State Government announces plans to recruit 1800 additional health workers to strengthen healthcare delivery.',
    fullContent: `The Kaduna State Government has announced an ambitious plan to recruit 1,800 health workers across various cadres to strengthen healthcare delivery in the state. This major recruitment drive is part of the government's commitment to improving the health sector and ensuring adequate staffing at all levels of healthcare facilities.

The Commissioner for Health, Dr. Amina Mohammed-Kani, disclosed this during a press briefing at the Ministry's headquarters in Kaduna. She emphasized that the recruitment would cover doctors, nurses, midwives, laboratory scientists, pharmacists, and other allied health professionals.

"This recruitment is in line with our administration's commitment to revitalizing the health sector and providing quality healthcare services to all residents of Kaduna State," the Commissioner stated. "We have identified critical gaps in our healthcare workforce, particularly in rural and underserved areas, and this recruitment will help address these shortages."

The recruitment process will be transparent and merit-based, with applications invited from qualified candidates across Nigeria. Priority will be given to candidates who are willing to work in rural healthcare facilities where the need is most acute.

Key positions to be filled include:
- Medical Officers: 300 positions
- Nurses/Midwives: 800 positions
- Laboratory Scientists: 150 positions
- Pharmacists: 100 positions
- Community Health Extension Workers: 400 positions
- Allied Health Professionals: 50 positions

The state government has allocated substantial funds in the current budget to cover the salaries and allowances of the new recruits. Additionally, plans are in place to provide housing and transportation support for those posted to rural areas.

The Ministry of Health has also announced training and capacity-building programs for all new recruits to ensure they are equipped with the latest skills and knowledge in healthcare delivery. This includes orientation programs, mentorship schemes, and continuous professional development opportunities.

Civil society organizations and healthcare advocacy groups have welcomed this development, describing it as a positive step towards achieving Universal Health Coverage in the state. They urged the government to ensure that the recruitment process is transparent and that the right candidates are selected based on merit.

The application portal is expected to open within the next two weeks, and interested candidates are advised to visit the Kaduna State Ministry of Health website for detailed information on eligibility criteria, required documents, and application procedures.`,
    source: 'TGNews',
    date: '2025-05-01',
    category: 'PHC Agenda',
    priority: 'high',
    type: 'news',
    author: 'TGNews Editorial Team',
    imageUrl: null,
  },
  'kaduna-2': {
    id: 'kaduna-2',
    title: 'ISMPH Trains Kaduna Journalists on Health Reporting',
    description: 'Capacity building workshop for journalists to improve health reporting and advocacy.',
    fullContent: `The International Society of Media in Public Health (ISMPH) has successfully concluded a comprehensive training workshop for journalists in Kaduna State, focusing on improving health reporting and advocacy. The three-day intensive program brought together over 50 media practitioners from print, broadcast, and online platforms.

The workshop, held at the prestigious Hamdala Hotel in Kaduna, was designed to enhance the capacity of journalists to effectively report on health issues, particularly those affecting primary healthcare delivery in the state. Participants were trained on various aspects of health journalism, including ethical reporting, data interpretation, and investigative techniques.

Dr. Musa Usman, Executive Director of ISMPH, emphasized the critical role of media in shaping public health narratives and influencing policy decisions. "Journalists are vital partners in our efforts to improve healthcare delivery. Through accurate and impactful reporting, they can hold governments accountable, raise awareness about health issues, and advocate for better policies," he stated.

The training covered several key areas:

1. Understanding Primary Healthcare Systems
Participants were introduced to the structure and functioning of primary healthcare systems in Nigeria, with particular emphasis on Kaduna State's healthcare landscape. They learned about the challenges facing PHCs, including funding constraints, workforce shortages, and infrastructure deficits.

2. Ethical Health Reporting
Seasoned health journalists and medical professionals led sessions on ethical considerations in health reporting, including patient privacy, informed consent, and responsible use of medical terminology. Participants were cautioned against sensationalism and encouraged to maintain accuracy in their reports.

3. Data Journalism for Health Reporting
In an era of big data, journalists were trained on how to interpret health statistics, read medical research papers, and present complex data in ways that the general public can understand. This included hands-on sessions on data visualization tools.

4. Investigative Health Journalism
Participants learned investigative techniques specific to health reporting, including how to uncover corruption in the health sector, track government health spending, and expose malpractices in healthcare facilities.

5. Advocacy Through Storytelling
The workshop emphasized the power of human-interest stories in health advocacy. Journalists practiced writing compelling narratives that highlight the experiences of patients and healthcare workers, making health issues more relatable to audiences.

Resource persons included Dr. Halima Sadiq, a public health expert from Ahmadu Bello University; Mr. John Ekaette, an award-winning health journalist from The Guardian; and representatives from the Kaduna State Ministry of Health.

At the end of the workshop, participants presented draft health stories that demonstrated their newly acquired skills. The best stories will be published in major newspapers and featured on radio and television programs across the state.

The Kaduna State Commissioner for Health, Dr. Amina Mohammed-Kani, who was a special guest at the closing ceremony, commended ISMPH for the initiative. She pledged her ministry's commitment to supporting journalists in accessing health facilities and obtaining accurate information for their reports.

Participants expressed appreciation for the training and called for regular capacity-building programs to keep them updated on emerging health issues and reporting techniques. ISMPH has promised to organize follow-up workshops and establish a network of trained health journalists for continued collaboration.`,
    source: 'Vanguard',
    date: '2025-05-01',
    category: 'Capacity Building',
    priority: 'medium',
    type: 'news',
    author: 'Vanguard Correspondents',
    imageUrl: null,
  },
  // Add more news items as needed - using same structure
};

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams();
  const article = NEWS_DATA[id as string];

  if (!article) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Article Not Found</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>The requested article could not be found.</Text>
        </View>
      </View>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return COLORS.priorityHigh;
      case 'medium': return COLORS.priorityMedium;
      case 'low': return COLORS.priorityLow;
      default: return COLORS.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>News Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Share2 size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.articleCard} variant="elevated">
          <View style={styles.badgeRow}>
            <Badge label={article.priority.toUpperCase()} variant={article.priority} type="priority" />
            <View style={[styles.categoryBadge, { backgroundColor: getPriorityColor(article.priority) + '20' }]}>
              <Text style={[styles.categoryText, { color: getPriorityColor(article.priority) }]}>
                {article.category}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{article.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Calendar size={14} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</Text>
            </View>
            <View style={styles.metaItem}>
              <Tag size={14} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{article.source}</Text>
            </View>
          </View>

          {article.author && (
            <Text style={styles.author}>By {article.author}</Text>
          )}

          <View style={styles.divider} />

          <Text style={styles.description}>{article.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.fullContent}>{article.fullContent}</Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Source: {article.source}</Text>
            <Text style={styles.footerText}>Published: {new Date(article.date).toLocaleDateString()}</Text>
          </View>
        </Card>

        <Card style={styles.relatedCard} variant="outlined">
          <Text style={styles.relatedTitle}>About This Category</Text>
          <Text style={styles.relatedText}>
            This article belongs to the {article.category} category, covering important updates and developments in healthcare.
          </Text>
        </Card>

        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: SPACING.xl + 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { marginRight: SPACING.md },
  headerTitle: { ...TYPOGRAPHY.h3, color: COLORS.white, flex: 1 },
  shareButton: { padding: SPACING.sm },
  content: { flex: 1 },
  articleCard: { margin: SPACING.md },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md, gap: SPACING.sm },
  categoryBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: 8 },
  categoryText: { ...TYPOGRAPHY.caption, fontWeight: '600' },
  title: { ...TYPOGRAPHY.h2, color: COLORS.text, marginBottom: SPACING.md, lineHeight: 32 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md, marginBottom: SPACING.sm },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  metaText: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  author: { ...TYPOGRAPHY.body2, color: COLORS.primary, fontStyle: 'italic', marginBottom: SPACING.md },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  description: { ...TYPOGRAPHY.body1, color: COLORS.text, fontWeight: '600', marginBottom: SPACING.md, lineHeight: 24 },
  fullContent: { ...TYPOGRAPHY.body1, color: COLORS.text, lineHeight: 28, textAlign: 'justify' },
  footer: { marginTop: SPACING.lg, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  footerText: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  relatedCard: { margin: SPACING.md, marginTop: 0 },
  relatedTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: SPACING.sm },
  relatedText: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, lineHeight: 22 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  errorText: { ...TYPOGRAPHY.body1, color: COLORS.textSecondary, textAlign: 'center' },
});
