import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { FormInput } from '@/src/components/FormInput';
import { Badge } from '@/src/components/Badge';
import { SocialFooter } from '@/src/components/SocialFooter';
import { COLORS, SPACING, TYPOGRAPHY, STATES } from '@/src/constants/theme';
import { Plus, FileText, Clock, CheckCircle, XCircle, Camera, Image as ImageIcon, Trash2 } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';

const CATEGORIES = [
  'Service Quality',
  'Infrastructure',
  'Staff Behavior',
  'Equipment Shortage',
  'Drug Availability',
  'Emergency Response',
  'Others',
];

const DEMO_REPORTS = [
  {
    id: '1',
    title: 'Equipment Shortage at Ikeja PHC',
    category: 'Equipment Shortage',
    description: 'Critical shortage of medical equipment affecting patient care quality.',
    state: 'Lagos',
    status: 'pending',
    priority: 'high',
    createdAt: '2025-10-28',
    contactName: 'John Doe',
    contactPhone: '080-1234-5678',
  },
  {
    id: '2',
    title: 'Excellent Service at Garki Hospital',
    category: 'Service Quality',
    description: 'Commendable service delivery and staff professionalism.',
    state: 'Abuja',
    status: 'approved',
    priority: 'low',
    createdAt: '2025-10-27',
    contactName: 'Jane Smith',
    contactEmail: 'jane@example.com',
  },
];

export default function ReportsScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'my' | 'pending'>('all');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Service Quality',
    description: '',
    state: user?.state || 'Lagos',
    priority: 'medium' as 'low' | 'medium' | 'high',
    reporterName: user?.full_name || '',
    reporterEmail: user?.email || '',
    reporterPhone: '',
    reporterAddress: '',
  });

  const requestPermissions = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus.status !== 'granted' || galleryStatus.status !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Camera and gallery access are needed to upload media.',
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
      allowsMultipleSelection: true,
      quality: 0.8,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setSelectedImages(prev => [...prev, ...newImages]);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets) {
      setSelectedImages(prev => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please fill in all required fields',
      });
      return;
    }

    if (!formData.reporterName || !formData.reporterEmail) {
      Toast.show({
        type: 'error',
        text1: 'Contact Information Required',
        text2: 'Please provide your name and email',
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Report Submitted',
      text2: `Your report has been submitted with ${selectedImages.length} media attachments`,
    });
    setShowForm(false);
    setSelectedImages([]);
    setFormData({
      title: '',
      category: 'Service Quality',
      description: '',
      state: user?.state || 'Lagos',
      priority: 'medium',
      reporterName: user?.full_name || '',
      reporterEmail: user?.email || '',
      reporterPhone: '',
      reporterAddress: '',
    });
  };

  const renderReport = (report: any) => (
    <Card key={report.id} style={styles.reportCard} variant="outlined">
      <View style={styles.reportHeader}>
        <View style={styles.reportHeaderLeft}>
          <Badge label={report.status.toUpperCase()} variant={report.status} type="status" />
          <Badge label={report.priority.toUpperCase()} variant={report.priority} type="priority" style={{ marginLeft: SPACING.xs }} />
        </View>
        <Text style={styles.reportDate}>{new Date(report.createdAt).toLocaleDateString()}</Text>
      </View>
      
      <Text style={styles.reportTitle}>{report.title}</Text>
      <Text style={styles.reportCategory}>{report.category} • {report.state}</Text>
      <Text style={styles.reportDescription} numberOfLines={2}>{report.description}</Text>
      
      {report.contactName && (
        <Text style={styles.reportContact}>Contact: {report.contactName}</Text>
      )}
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
        <Text style={styles.headerTitle}>PHC State Reports</Text>
        <Text style={styles.headerSubtitle}>Submit and track facility reports</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'all' && styles.tabActive]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.tabTextActive]}>All Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'my' && styles.tabActive]}
          onPress={() => setSelectedTab('my')}
        >
          <Text style={[styles.tabText, selectedTab === 'my' && styles.tabTextActive]}>My Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'pending' && styles.tabActive]}
          onPress={() => setSelectedTab('pending')}
        >
          <Text style={[styles.tabText, selectedTab === 'pending' && styles.tabTextActive]}>Pending</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsRow}>
          <Card style={styles.statCard} variant="elevated">
            <FileText size={24} color={COLORS.info} />
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Total</Text>
          </Card>
          <Card style={styles.statCard} variant="elevated">
            <Clock size={24} color={COLORS.warning} />
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </Card>
          <Card style={styles.statCard} variant="elevated">
            <CheckCircle size={24} color={COLORS.success} />
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reports</Text>
          {DEMO_REPORTS.map(renderReport)}
        </View>

        <SocialFooter />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setShowForm(true)}>
        <Plus size={24} color={COLORS.white} />
      </TouchableOpacity>

      <Modal visible={showForm} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Submit New Report</Text>
            <TouchableOpacity onPress={() => setShowForm(false)}>
              <XCircle size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <Text style={styles.sectionLabel}>Report Details</Text>
            
            <FormInput
              label="Report Title"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Brief summary of the issue"
              required
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>State</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsRow}>
                {STATES.map((state) => (
                  <TouchableOpacity
                    key={state}
                    style={[styles.optionChip, formData.state === state && styles.optionChipActive]}
                    onPress={() => setFormData({ ...formData, state })}
                  >
                    <Text style={[styles.optionText, formData.state === state && styles.optionTextActive]}>
                      {state}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsRow}>
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[styles.optionChip, formData.category === category && styles.optionChipActive]}
                    onPress={() => setFormData({ ...formData, category })}
                  >
                    <Text style={[styles.optionText, formData.category === category && styles.optionTextActive]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <FormInput
              label="Detailed Description"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Provide detailed information..."
              multiline
              numberOfLines={6}
              required
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.priorityRow}>
                {(['low', 'medium', 'high'] as const).map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[styles.priorityChip, formData.priority === priority && styles.priorityChipActive]}
                    onPress={() => setFormData({ ...formData, priority })}
                  >
                    <Text style={[styles.priorityText, formData.priority === priority && styles.priorityTextActive]}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.sectionLabel}>Contact Information</Text>

            <FormInput
              label="Your Full Name"
              value={formData.reporterName}
              onChangeText={(text) => setFormData({ ...formData, reporterName: text })}
              placeholder="Enter your full name"
              required
            />

            <FormInput
              label="Email Address"
              value={formData.reporterEmail}
              onChangeText={(text) => setFormData({ ...formData, reporterEmail: text })}
              placeholder="your.email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              required
            />

            <FormInput
              label="Phone Number"
              value={formData.reporterPhone}
              onChangeText={(text) => setFormData({ ...formData, reporterPhone: text })}
              placeholder="080-XXXX-XXXX"
              keyboardType="phone-pad"
            />

            <FormInput
              label="Address (Optional)"
              value={formData.reporterAddress}
              onChangeText={(text) => setFormData({ ...formData, reporterAddress: text })}
              placeholder="Your address"
              multiline
              numberOfLines={3}
            />

            <Text style={styles.sectionLabel}>Media Attachments</Text>

            <View style={styles.mediaButtons}>
              <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
                <Camera size={20} color={COLORS.primary} />
                <Text style={styles.mediaButtonText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.mediaButton} onPress={pickImageFromGallery}>
                <ImageIcon size={20} color={COLORS.primary} />
                <Text style={styles.mediaButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>

            {selectedImages.length > 0 && (
              <View style={styles.imagesContainer}>
                <Text style={styles.imagesLabel}>{selectedImages.length} image(s) selected</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesList}>
                  {selectedImages.map((uri, index) => (
                    <View key={index} style={styles.imageItem}>
                      <Image source={{ uri }} style={styles.imagePreview} />
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeImage(index)}
                      >
                        <Trash2 size={16} color={COLORS.white} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.formActions}>
              <Button title="Cancel" onPress={() => setShowForm(false)} variant="outline" style={{ flex: 1, marginRight: SPACING.sm }} />
              <Button title="Submit Report" onPress={handleSubmit} style={{ flex: 1 }} />
            </View>
          </ScrollView>
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
  headerSubtitle: { ...TYPOGRAPHY.body2, color: COLORS.white, opacity: 0.9, marginTop: SPACING.xs },
  tabsContainer: { flexDirection: 'row', backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { flex: 1, paddingVertical: SPACING.md, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.primary, fontWeight: '600' },
  content: { flex: 1 },
  statsRow: { flexDirection: 'row', padding: SPACING.md, gap: SPACING.sm },
  statCard: { flex: 1, alignItems: 'center', padding: SPACING.md },
  statValue: { ...TYPOGRAPHY.h2, color: COLORS.text, marginTop: SPACING.xs },
  statLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.xs },
  section: { padding: SPACING.md },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, marginBottom: SPACING.md },
  sectionLabel: { ...TYPOGRAPHY.h4, color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.md },
  reportCard: { marginBottom: SPACING.md },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  reportHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  reportDate: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  reportTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  reportCategory: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  reportDescription: { ...TYPOGRAPHY.body2, color: COLORS.text, marginBottom: SPACING.xs },
  reportContact: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },
  fab: { position: 'absolute', right: SPACING.lg, bottom: SPACING.lg, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
  modalContainer: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingTop: SPACING.xl + 20 },
  modalTitle: { ...TYPOGRAPHY.h3, color: COLORS.text },
  form: { flex: 1, padding: SPACING.lg },
  label: { ...TYPOGRAPHY.body2, color: COLORS.text, marginBottom: SPACING.xs, fontWeight: '600' },
  pickerContainer: { marginBottom: SPACING.md },
  optionsRow: { flexDirection: 'row' },
  optionChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 8, backgroundColor: COLORS.surface, marginRight: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  optionChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  optionText: { ...TYPOGRAPHY.body2, color: COLORS.text },
  optionTextActive: { color: COLORS.white, fontWeight: '600' },
  priorityRow: { flexDirection: 'row', gap: SPACING.sm },
  priorityChip: { flex: 1, paddingVertical: SPACING.sm, borderRadius: 8, backgroundColor: COLORS.surface, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  priorityChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  priorityText: { ...TYPOGRAPHY.body2, color: COLORS.text, fontWeight: '600' },
  priorityTextActive: { color: COLORS.white },
  mediaButtons: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  mediaButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: SPACING.md, borderRadius: 8, borderWidth: 2, borderColor: COLORS.primary, borderStyle: 'dashed', gap: SPACING.sm },
  mediaButtonText: { ...TYPOGRAPHY.body2, color: COLORS.primary, fontWeight: '600' },
  imagesContainer: { marginBottom: SPACING.lg },
  imagesLabel: { ...TYPOGRAPHY.body2, fontWeight: '600', marginBottom: SPACING.sm },
  imagesList: { flexDirection: 'row' },
  imageItem: { position: 'relative', marginRight: SPACING.sm },
  imagePreview: { width: 100, height: 100, borderRadius: 8 },
  removeButton: { position: 'absolute', top: -8, right: -8, width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.error, alignItems: 'center', justifyContent: 'center' },
  formActions: { flexDirection: 'row', marginTop: SPACING.lg, marginBottom: SPACING.xl },
});
