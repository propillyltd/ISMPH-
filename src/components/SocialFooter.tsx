import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { MessageCircle, Instagram, Facebook, Mail, Youtube } from 'lucide-react-native';

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
          onPress={() => openLink('https://www.instagram.com/ismphng?igsh=MWtic2l2bjdjbHoybA==')}
        >
          <Instagram size={24} color="#E4405F" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: '#000000' + '20' }]}
          onPress={() => openLink('https://x.com/ISMPHNG?s=09')}
        >
          <MessageCircle size={24} color="#000000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: '#0077B5' + '20' }]}
          onPress={() => openLink('https://www.linkedin.com/company/ismph/')}
        >
          <Facebook size={24} color="#0077B5" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: '#4267B2' + '20' }]}
          onPress={() => openLink('https://www.facebook.com/ismph?mibextid=ZbWKwL')}
        >
          <Facebook size={24} color="#4267B2" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: '#FF0000' + '20' }]}
          onPress={() => openLink('https://youtube.com/@ismphnigeria8768?si=Y5AwYZu5nxAJYolp')}
        >
          <Youtube size={24} color="#FF0000" />
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
