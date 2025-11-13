import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Switch,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { RootState, AppDispatch } from '@/src/store';
import { signOut, setUser } from '@/src/store/slices/authSlice';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import {
  User,
  Settings,
  LogOut,
  Bell,
  Globe,
  Camera,
  Image as ImageIcon,
  X,
  ChevronRight,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/src/services/supabase';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
];

// Language translations
const TRANSLATIONS = {
  en: {
    profile: 'Profile',
    preferences: 'Preferences',
    notifications: 'Notifications',
    language: 'Language',
    settings: 'Settings',
    signOut: 'Sign Out',
  },
  ha: {
    profile: 'Profile',
    preferences: 'Zaɓuɓɓuka',
    notifications: 'Sanarwa',
    language: 'Harshe',
    settings: 'Saituna',
    signOut: 'Fita',
  },
  yo: {
    profile: 'Profaili',
    preferences: 'Awọn ayanfẹ',
    notifications: 'Awọn iwifunni',
    language: 'Ede',
    settings: 'Eto',
    signOut: 'Jade',
  },
  ig: {
    profile: 'Profaịlụ',
    preferences: 'Mmasị',
    notifications: 'Ngosi',
    language: 'Asụsụ',
    settings: 'Ntọala',
    signOut: 'Pụọ',
  },
};

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notification_enabled ?? true);
  const [selectedLanguage, setSelectedLanguage] = useState(user?.language_preference || 'en');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Check for language tab parameter from settings
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'language') {
      setShowLanguageModal(true);
    }
  }, []);

  // Get translations based on selected language
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  const requestPermissions = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus.status !== 'granted' || galleryStatus.status !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Camera and gallery access are needed to upload profile picture.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadProfilePicture(result.assets[0].uri);
    }
    setShowImagePicker(false);
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadProfilePicture(result.assets[0].uri);
    }
    setShowImagePicker(false);
  };

  const uploadProfilePicture = async (uri: string) => {
    if (!user?.id) return;

    try {
      setUploadingImage(true);

      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = `${user.id}-${Date.now()}.jpg`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      dispatch(setUser({ ...user, avatar_url: publicUrl }));

      Toast.show({
        type: 'success',
        text1: 'Profile Picture Updated',
        text2: 'Your profile picture has been updated successfully',
      });
    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: 'Failed to upload profile picture. Please try again.',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const toggleNotifications = async (value: boolean) => {
    if (!user?.id) return;

    try {
      setNotificationsEnabled(value);

      const { error } = await supabase
        .from('profiles')
        .update({ notification_enabled: value })
        .eq('id', user.id);

      if (error) throw error;

      dispatch(setUser({ ...user, notification_enabled: value }));

      Toast.show({
        type: 'success',
        text1: 'Notifications Updated',
        text2: `Notifications ${value ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error updating notifications:', error);
      setNotificationsEnabled(!value);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Failed to update notification settings',
      });
    }
  };

  const updateLanguage = async (languageCode: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ language_preference: languageCode })
        .eq('id', user.id);

      if (error) throw error;

      setSelectedLanguage(languageCode);
      dispatch(setUser({ ...user, language_preference: languageCode }));
      setShowLanguageModal(false);

      Toast.show({
        type: 'success',
        text1: 'Language Updated',
        text2: `Language changed to ${LANGUAGES.find(l => l.code === languageCode)?.name}`,
      });
    } catch (error) {
      console.error('Error updating language:', error);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Failed to update language preference',
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await dispatch(signOut()).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Signed Out',
        text2: 'Successfully signed out',
      });
      router.replace('/auth');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to sign out',
      });
    }
  };

  const getLanguageName = () => {
    return LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'English';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>{t.profile}</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.profileCard} variant="elevated">
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={() => setShowImagePicker(true)}
              disabled={uploadingImage}
            >
              {user?.avatar_url ? (
                <Image source={{ uri: user.avatar_url }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <User size={48} color={COLORS.white} />
                </View>
              )}
              <View style={styles.cameraButton}>
                <Camera size={16} color={COLORS.white} />
              </View>
              {uploadingImage && (
                <View style={styles.uploadingOverlay}>
                  <Text style={styles.uploadingText}>Uploading...</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user?.full_name || user?.email || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.roleContainer}>
            <Text style={styles.role}>{user?.role?.toUpperCase()}</Text>
            {user?.state && <Text style={styles.state}>{user.state}</Text>}
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.preferences}</Text>

          <Card style={styles.menuCard}>
            <View style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Bell size={24} color={COLORS.text} />
                <Text style={styles.menuText}>{t.notifications}</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            </View>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setShowLanguageModal(true)}
            >
              <View style={styles.menuLeft}>
                <Globe size={24} color={COLORS.text} />
                <Text style={styles.menuText}>{t.language}</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.menuValue}>{getLanguageName()}</Text>
                <ChevronRight size={20} color={COLORS.textSecondary} />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings')}>
              <View style={styles.menuLeft}>
                <Settings size={24} color={COLORS.text} />
                <Text style={styles.menuText}>{t.settings}</Text>
              </View>
              <ChevronRight size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.section}>
          <Button
            title={t.signOut}
            onPress={handleSignOut}
            variant="secondary"
            icon={<LogOut size={20} color={COLORS.white} />}
          />
        </View>

        <View style={{ height: SPACING.xl }} />
      </ScrollView>

      {/* Image Picker Modal */}
      <Modal visible={showImagePicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Profile Picture</Text>
              <TouchableOpacity onPress={() => setShowImagePicker(false)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.modalOption} onPress={takePhoto}>
              <Camera size={24} color={COLORS.primary} />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <View style={styles.modalDivider} />

            <TouchableOpacity style={styles.modalOption} onPress={pickImageFromGallery}>
              <ImageIcon size={24} color={COLORS.primary} />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <Button
              title="Cancel"
              onPress={() => setShowImagePicker(false)}
              variant="outline"
              style={{ marginTop: SPACING.md }}
            />
          </View>
        </View>
      </Modal>

      {/* Language Selection Modal */}
      <Modal visible={showLanguageModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {LANGUAGES.map((language, index) => (
              <React.Fragment key={language.code}>
                <TouchableOpacity
                  style={styles.languageOption}
                  onPress={() => updateLanguage(language.code)}
                >
                  <View style={styles.languageLeft}>
                    <Text style={styles.languageFlag}>{language.flag}</Text>
                    <Text style={styles.languageText}>{language.name}</Text>
                  </View>
                  {selectedLanguage === language.code && (
                    <View style={styles.selectedIndicator} />
                  )}
                </TouchableOpacity>
                {index < LANGUAGES.length - 1 && <View style={styles.modalDivider} />}
              </React.Fragment>
            ))}

            <Button
              title="Cancel"
              onPress={() => setShowLanguageModal(false)}
              variant="outline"
              style={{ marginTop: SPACING.md }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: SPACING.lg, paddingTop: SPACING.xl + 20, alignItems: 'center' },
  logo: { width: 60, height: 60, marginBottom: SPACING.sm },
  headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.white },
  content: { flex: 1, padding: SPACING.md },
  profileCard: { alignItems: 'center', padding: SPACING.xl },
  avatarContainer: { marginBottom: SPACING.md },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: 100, height: 100, borderRadius: 50 },
  cameraButton: { position: 'absolute', right: 0, bottom: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.secondary, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: COLORS.white },
  uploadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  uploadingText: { ...TYPOGRAPHY.caption, color: COLORS.white, fontWeight: '600' },
  name: { ...TYPOGRAPHY.h3, color: COLORS.text, marginBottom: SPACING.xs },
  email: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  roleContainer: { flexDirection: 'row', gap: SPACING.sm },
  role: { ...TYPOGRAPHY.caption, color: COLORS.white, backgroundColor: COLORS.primary, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: 12, fontWeight: '600' },
  state: { ...TYPOGRAPHY.caption, color: COLORS.white, backgroundColor: COLORS.info, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: 12, fontWeight: '600' },
  section: { marginTop: SPACING.lg },
  sectionTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: SPACING.md },
  menuCard: { padding: 0 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  menuText: { ...TYPOGRAPHY.body1, color: COLORS.text },
  menuValue: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary },
  divider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: SPACING.md },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: SPACING.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { ...TYPOGRAPHY.h3, color: COLORS.text },
  modalOption: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.md },
  modalOptionText: { ...TYPOGRAPHY.body1, color: COLORS.text },
  modalDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.xs },

  languageOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.md },
  languageLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  languageFlag: { fontSize: 28 },
  languageText: { ...TYPOGRAPHY.body1, color: COLORS.text },
  selectedIndicator: { width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.primary },
});
