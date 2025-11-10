import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import { ArrowLeft, Settings, User, Bell, Globe, Shield, HelpCircle } from 'lucide-react-native';
import { useLanguage } from '@/src/contexts/LanguageContext';

export default function SettingsScreen() {
  const { t } = useLanguage();

  const settingsOptions = [
    {
      icon: User,
      title: t('accountSettings'),
      description: t('accountSettingsDesc'),
      onPress: () => router.push('/profile'),
    },
    {
      icon: Bell,
      title: t('notifications'),
      description: t('notificationsDesc'),
      onPress: () => router.push('/profile'), // Navigate to profile for notifications
    },
    {
      icon: Globe,
      title: t('language'),
      description: t('languageDesc'),
      onPress: () => {
        // Open language modal directly from settings
        router.push('/profile?tab=language');
      },
    },
    {
      icon: Shield,
      title: t('privacySecurity'),
      description: t('privacySecurityDesc'),
      onPress: () => {/* Handle privacy */},
    },
    {
      icon: HelpCircle,
      title: t('helpSupport'),
      description: t('helpSupportDesc'),
      onPress: () => {/* Handle help */},
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title=""
          onPress={() => router.back()}
          variant="ghost"
          icon={<ArrowLeft size={24} color={COLORS.white} />}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>{t('settings')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>{t('general')}</Text>

        {settingsOptions.map((option, index) => (
          <Card key={index} style={styles.settingCard} variant="outlined" onPress={option.onPress}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: COLORS.primary + '20' }]}>
                <option.icon size={24} color={COLORS.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{option.title}</Text>
                <Text style={styles.settingDescription}>{option.description}</Text>
              </View>
            </View>
            <ArrowLeft size={20} color={COLORS.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
          </Card>
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about')}</Text>
          <Card style={styles.aboutCard} variant="outlined">
            <Text style={styles.appName}>ISMPH Media Tracker</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              International Society of Media in Public Health
            </Text>
          </Card>
        </View>
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
  backButton: { padding: 0, width: 40, height: 40 },
  headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.white },
  content: { flex: 1, padding: SPACING.md },
  sectionTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: SPACING.md, marginTop: SPACING.lg },
  settingCard: { marginBottom: SPACING.sm, padding: SPACING.md },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  settingContent: { flex: 1 },
  settingTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  settingDescription: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  section: { marginTop: SPACING.xl },
  aboutCard: { padding: SPACING.lg, alignItems: 'center' },
  appName: { ...TYPOGRAPHY.h3, color: COLORS.text, marginBottom: SPACING.xs },
  appVersion: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  appDescription: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, textAlign: 'center' },
});