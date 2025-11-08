import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '@/src/store/slices/authSlice';
import { AppDispatch, RootState } from '@/src/store';
import { FormInput } from '@/src/components/FormInput';
import { Button } from '@/src/components/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import Toast from 'react-native-toast-message';
import { ArrowLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Email Required',
        text2: 'Please enter your email address',
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address',
      });
      return;
    }

    try {
      await dispatch(resetPassword(email)).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Reset Email Sent',
        text2: 'Check your email for password reset instructions',
      });
      router.back();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: error || 'Failed to send reset email. Please try again.',
      });
    }
  };

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
        <Text style={styles.headerTitle}>Reset Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.description}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>

          <FormInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="your.email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            required
          />

          <Button
            title="Send Reset Link"
            onPress={handleResetPassword}
            loading={loading}
            style={styles.submitButton}
          />

          <Button
            title="Back to Sign In"
            onPress={() => router.back()}
            variant="outline"
            style={styles.backToSignInButton}
          />
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
  content: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: SPACING.lg },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.xl,
  },
  title: { ...TYPOGRAPHY.h1, color: COLORS.text, marginBottom: SPACING.sm, textAlign: 'center' },
  description: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginBottom: SPACING.xl, textAlign: 'center', lineHeight: 20 },
  submitButton: { marginTop: SPACING.lg },
  backToSignInButton: { marginTop: SPACING.md },
});