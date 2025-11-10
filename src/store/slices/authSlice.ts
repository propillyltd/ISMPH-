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
