import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { signIn, signUp } from '@/src/store/slices/authSlice';
import { AppDispatch, RootState } from '@/src/store';
import { FormInput } from '@/src/components/FormInput';
import { Button } from '@/src/components/Button';
import { COLORS, SPACING, TYPOGRAPHY, STATES } from '@/src/constants/theme';
import Toast from 'react-native-toast-message';

export default function AuthScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('public');
  const [state, setState] = useState('Lagos');

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        await dispatch(signUp({ email, password, fullName, role, state })).unwrap();
        Toast.show({
          type: 'success',
          text1: 'Account Created',
          text2: 'Welcome to ISMPH Media Tracker',
        });
      } else {
        await dispatch(signIn({ email, password })).unwrap();
        Toast.show({
          type: 'success',
          text1: 'Welcome Back',
          text2: 'Successfully signed in',
        });
      }
      router.replace('/(tabs)');
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Authentication Error',
        text2: err || 'Please try again',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>ISMPH Media Tracker</Text>
          <Text style={styles.subtitle}>
            International Society of Media in Public Health
          </Text>
        </View>

        <View style={styles.form}>
          <FormInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            required
          />

          <FormInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            required
          />

          {isSignUp && (
            <>
              <FormInput
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                required
              />

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Role</Text>
                <View style={styles.roleButtons}>
                  {['public', 'staff', 'admin'].map((r) => (
                    <TouchableOpacity
                      key={r}
                      style={[styles.roleButton, role === r && styles.roleButtonActive]}
                      onPress={() => setRole(r)}
                    >
                      <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>State</Text>
                <View style={styles.roleButtons}>
                  {STATES.map((s: string) => (
                    <TouchableOpacity
                      key={s}
                      style={[styles.stateButton, state === s && styles.roleButtonActive]}
                      onPress={() => setState(s)}
                    >
                      <Text style={[styles.roleText, state === s && styles.roleTextActive]}>
                        {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}

          <Button
            title={isSignUp ? 'Sign Up' : 'Sign In'}
            onPress={handleAuth}
            loading={loading}
            style={styles.submitButton}
          />

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.switchText}>
              {isSignUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body2,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  roleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  roleButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  stateButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  roleButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  roleText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
  },
  roleTextActive: {
    color: COLORS.white,
  },
  submitButton: {
    marginTop: SPACING.md,
  },
  switchText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});
