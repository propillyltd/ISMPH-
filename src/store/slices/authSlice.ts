import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '@/src/services/supabase';

interface User {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  state?: string;
  language_preference?: string;
  notification_enabled?: boolean;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      console.log('🔐 Starting sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign in auth error:', error);
        throw error;
      }

      if (!data.user) {
        console.error('❌ No user data returned from sign in');
        throw new Error('Authentication failed');
      }

      console.log('✅ Auth successful, user ID:', data.user.id);

      // Get user profile data
      console.log('📋 Fetching user profile...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.warn('⚠️ Profile fetch failed:', profileError);
        // If profile doesn't exist, create one
        console.log('🛠️ Creating new profile...');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: data.user.user_metadata?.full_name || data.user.email!.split('@')[0],
            role: 'public',
            state: 'Lagos',
          })
          .select()
          .single();

        if (createError) {
          console.error('❌ Profile creation failed:', createError);
          console.warn('⚠️ Could not create profile, using default data');
          // Return user data with default profile info
          return {
            user: {
              ...data.user,
              email: data.user.email!,
              full_name: data.user.user_metadata?.full_name || data.user.email!.split('@')[0],
              role: 'public',
              state: 'Lagos',
            },
            session: data.session,
          };
        }

        console.log('✅ Profile created successfully');
        return {
          user: {
            ...data.user,
            ...newProfile,
          },
          session: data.session,
        };
      }

      console.log('✅ Profile found:', profile);
      return {
        user: {
          ...data.user,
          ...profile,
        },
        session: data.session,
      };
    } catch (error: any) {
      console.error('❌ Sign in failed:', error);
      return rejectWithValue(error.message || 'Sign in failed');
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (
    { email, password, fullName, role, state }: {
      email: string;
      password: string;
      fullName: string;
      role: string;
      state: string;
    },
    { rejectWithValue }
  ) => {
    try {
      console.log('📝 Starting sign up for:', email, 'with role:', role, 'state:', state);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role || 'public',
            state: state || 'Lagos',
          },
        },
      });

      if (error) {
        console.error('❌ Sign up auth error:', error);
        throw error;
      }

      if (!data.user) {
        console.error('❌ No user data returned from sign up');
        throw new Error('Registration failed');
      }

      console.log('✅ Auth user created, user ID:', data.user.id);
      console.log('📧 Email confirmation required:', !data.session);

      // For regular users, the database trigger will handle profile creation
      // For demo accounts, profiles are created by the trigger
      // We'll try to get the profile, but it might not exist immediately
      console.log('📋 Attempting to fetch user profile...');
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            console.log('ℹ️ Profile not found (expected for new users), will create manually');
            // Profile doesn't exist, create it manually
            console.log('🛠️ Creating profile manually...');
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email,
                full_name: fullName,
                role: role || 'public',
                state: state || 'Lagos',
              })
              .select()
              .single();

            if (createError) {
              console.error('❌ Manual profile creation failed:', createError);
              // Return user data without profile - app can handle this
              return {
                user: {
                  ...data.user,
                  email,
                  full_name: fullName,
                  role: role || 'public',
                  state: state || 'Lagos',
                },
                session: data.session,
              };
            }

            console.log('✅ Profile created manually:', newProfile);
            return {
              user: {
                ...data.user,
                ...newProfile,
              },
              session: data.session,
            };
          } else {
            console.warn('⚠️ Unexpected profile fetch error:', profileError);
          }
        } else {
          console.log('✅ Profile found:', profile);
        }

        return {
          user: {
            ...data.user,
            ...(profile || {
              email,
              full_name: fullName,
              role: role || 'public',
              state: state || 'Lagos',
            }),
          },
          session: data.session,
        };
      } catch (profileFetchError) {
        console.error('❌ Profile fetch/creation error:', profileFetchError);
        // If profile fetch fails, return user data without profile
        return {
          user: {
            ...data.user,
            email,
            full_name: fullName,
            role: role || 'public',
            state: state || 'Lagos',
          },
          session: data.session,
        };
      }
    } catch (error: any) {
      console.error('❌ Sign up failed:', error);
      return rejectWithValue(error.message || 'Sign up failed');
    }
  }
);

export const signOut = createAsyncThunk('auth/signOut', async (_, { rejectWithValue }) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Sign out failed');
  }
});

export const checkSession = createAsyncThunk('auth/checkSession', async (_, { rejectWithValue }) => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) throw error;

    if (!session) {
      throw new Error('No active session');
    }

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) throw profileError;

    return {
      user: {
        ...session.user,
        ...profile,
      },
      session,
    };
  } catch (error: any) {
    return rejectWithValue(error.message || 'Session check failed');
  }
});

export const validateSession = createAsyncThunk('auth/validateSession', async (_, { rejectWithValue }) => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) throw error;

    if (!session) {
      throw new Error('No active session');
    }

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) throw profileError;

    return {
      user: {
        ...session.user,
        ...profile,
      },
      session,
    };
  } catch (error: any) {
    return rejectWithValue(error.message || 'Session validation failed');
  }
});

export const setUser = createAsyncThunk(
  'auth/setUser',
  async (userData: Partial<User>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const currentUser = state.auth.user;

      if (!currentUser?.id) {
        throw new Error('No user logged in');
      }

      // Update profile in database
      const { data, error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', currentUser.id)
        .select()
        .single();

      if (error) throw error;

      return {
        ...currentUser,
        ...data,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Update failed');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.EXPO_PUBLIC_APP_URL || 'exp://'}/reset-password`,
      });

      if (error) throw error;

      return { message: 'Password reset email sent successfully' };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send password reset email');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      // Sign Out
      .addCase(signOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Check Session
      .addCase(checkSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(checkSession.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      // Validate Session
      .addCase(validateSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(validateSession.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(validateSession.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      // Set User
      .addCase(setUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(setUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(setUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;
