import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { MessageCircle, Instagram, Facebook, Mail } from 'lucide-react-native';

export const SocialFooter: React.FC = () => {
  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect With Us</Text>
      <View style={styles.iconsRow}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: '#25D366' + '20' }]}
          onPress={() => openLink('https://wa.me/2348012345678')}
        >
          <MessageCircle size={24} color="#25D366" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: '#E4405F' + '20' }]}
          onPress={() => openLink('https://instagram.com/ismph_nigeria')}
        >
          <Instagram size={24} color="#E4405F" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: '#1877F2' + '20' }]}
          onPress={() => openLink('https://facebook.com/ismph.nigeria')}
        >
          <Facebook size={24} color="#1877F2" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: COLORS.primary + '20' }]}
          onPress={() => openLink('mailto:info@ismph.org.ng')}
        >
          <Mail size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.copyright}>© 2025 ISMPH Nigeria. All rights reserved.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  iconsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyright: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
