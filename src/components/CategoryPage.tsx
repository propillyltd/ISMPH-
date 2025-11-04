import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import { Card } from './Card';
import { ArrowLeft, FileText, Newspaper, Scale } from 'lucide-react-native';

interface CategoryPageProps {
  id: string;
  name: string;
  fullName: string;
  description: string;
  icon: string;
  color: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  name,
  fullName,
  description,
  icon,
  color,
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: color }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.iconLarge}>{icon}</Text>
          <Text style={styles.headerTitle}>{name}</Text>
          <Text style={styles.headerSubtitle}>{fullName}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Overview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Card style={styles.overviewCard} variant="outlined">
            <Text style={styles.descriptionText}>{description}</Text>
          </Card>
        </View>

        {/* Key Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Information</Text>

          <Card style={styles.infoCard} variant="elevated">
            <View style={styles.infoHeader}>
              <View style={[styles.infoIcon, { backgroundColor: color + '20' }]}>
                <FileText size={24} color={color} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Related Reports</Text>
                <Text style={styles.infoSubtitle}>View reports tagged with this category</Text>
              </View>
            </View>
            <Text style={styles.comingSoon}>Coming soon</Text>
          </Card>

          <Card style={styles.infoCard} variant="elevated">
            <View style={styles.infoHeader}>
              <View style={[styles.infoIcon, { backgroundColor: color + '20' }]}>
                <Newspaper size={24} color={color} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Latest News</Text>
                <Text style={styles.infoSubtitle}>Stay updated with recent developments</Text>
              </View>
            </View>
            <Text style={styles.comingSoon}>Coming soon</Text>
          </Card>

          <Card style={styles.infoCard} variant="elevated">
            <View style={styles.infoHeader}>
              <View style={[styles.infoIcon, { backgroundColor: color + '20' }]}>
                <Scale size={24} color={color} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Policies & Guidelines</Text>
                <Text style={styles.infoSubtitle}>Official policies and frameworks</Text>
              </View>
            </View>
            <Text style={styles.comingSoon}>Coming soon</Text>
          </Card>
        </View>

        {/* Resources Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          <Card style={styles.resourceCard} variant="outlined">
            <Text style={styles.resourceText}>
              This section will contain educational materials, guidelines, and resources
              related to {fullName}. Check back soon for updates.
            </Text>
          </Card>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Need Help?</Text>
          <Card style={styles.contactCard} variant="outlined">
            <Text style={styles.contactText}>
              For more information about {name}, please contact your state program officer
              or use the feedback system to submit inquiries.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: SPACING.xl + 20,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: SPACING.md,
    top: SPACING.xl + 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  iconLarge: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.white,
    textAlign: 'center',
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  overviewCard: {
    padding: SPACING.lg,
  },
  descriptionText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.text,
    lineHeight: 24,
  },
  infoCard: {
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  infoSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  comingSoon: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  resourceCard: {
    padding: SPACING.lg,
  },
  resourceText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  contactCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.primaryLight + '10',
  },
  contactText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
    lineHeight: 22,
  },
});
