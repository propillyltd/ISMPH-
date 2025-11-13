import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface DemoAccount {
  email: string;
  password: string;
  role: string;
  fullName: string;
  state?: string;
  phone?: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'admin@ismph.org',
    password: 'ISMPH@Admin2024',
    role: 'super_admin',
    fullName: 'ISMPH Super Admin',
  },
  {
    email: 'staff@ismph.org',
    password: 'ISMPH@Staff2024',
    role: 'staff',
    fullName: 'Demo Staff Member',
    state: 'Lagos',
    phone: '08012345678',
  },
];

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Get Supabase URL and service role key from environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Create Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const results = [];

    // Create each demo account
    for (const account of DEMO_ACCOUNTS) {
      try {
        // Try to create the user
        const { data, error } = await supabase.auth.admin.createUser({
          email: account.email,
          password: account.password,
          email_confirm: true,
          user_metadata: {
            full_name: account.fullName,
          },
        });

        if (error) {
          if (error.message.includes('already registered')) {
            // User exists, try to update password
            const { data: users } = await supabase.auth.admin.listUsers();
            const existingUser = users.users.find((u) => u.email === account.email);

            if (existingUser) {
              const { error: updateError } = await supabase.auth.admin.updateUserById(
                existingUser.id,
                { password: account.password }
              );

              if (updateError) {
                results.push({
                  email: account.email,
                  status: 'error',
                  message: `Failed to update: ${updateError.message}`,
                });
              } else {
                results.push({
                  email: account.email,
                  status: 'updated',
                  message: 'Password updated successfully',
                });
              }
            }
          } else {
            results.push({
              email: account.email,
              status: 'error',
              message: error.message,
            });
          }
        } else {
          results.push({
            email: account.email,
            status: 'created',
            message: 'Account created successfully',
            userId: data.user.id,
          });
        }
      } catch (err) {
        results.push({
          email: account.email,
          status: 'error',
          message: err.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Demo account setup completed',
        results,
        credentials: DEMO_ACCOUNTS.map((acc) => ({
          email: acc.email,
          password: acc.password,
          role: acc.role,
          state: acc.state,
        })),
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
