import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

;(globalThis as any).Deno?.serve(async (req: any) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Create a client with the user's token to verify their identity/role
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      (globalThis as any).Deno?.env?.get('VITE_SUPABASE_URL') ?? '',
      (globalThis as any).Deno?.env?.get('VITE_SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Check if the user is an admin
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check for admin role
    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleData) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Create a client with Service Role Key to bypass RLS for data fetching
    const supabaseAdmin = createClient(
      (globalThis as any).Deno?.env?.get('SUPABASE_URL') ?? '',
      (globalThis as any).Deno?.env?.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 3. Fetch test_attempts with profiles
    const { data: attemptsData, error: attemptsError } = await supabaseAdmin
      .from('test_attempts')
      .select(`
        *,
        profiles (email, full_name)
      `)
      .order('completed_at', { ascending: false });

    if (attemptsError) {
      console.error('Error fetching attempts:', attemptsError);
      throw attemptsError;
    }

    // 4. Fetch user_details for the users found in attempts
    const userIds = attemptsData.map((a: any) => a.user_id);
    // Remove duplicates
    const uniqueUserIds = [...new Set(userIds)];

    let userDetailsMap: Record<string, any> = {};

    if (uniqueUserIds.length > 0) {
      const { data: detailsData, error: detailsError } = await supabaseAdmin
        .from('user_details')
        .select('*')
        .in('user_id', uniqueUserIds);

      if (detailsError) {
        console.error('Error fetching user details:', detailsError);
        // We continue even if details fail, just without details
      } else if (detailsData) {
        // Create a map for easy lookup
        detailsData.forEach((detail: any) => {
          userDetailsMap[detail.user_id] = detail;
        });
      }
    }

    // 5. Merge data
    const mergedData = attemptsData.map((attempt: any) => ({
      ...attempt,
      // Add user_details to the response mapped to 'userDetails' to match frontend interface
      userDetails: userDetailsMap[attempt.user_id] || null
    }));

    return new Response(JSON.stringify({ data: mergedData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (e) {
    console.error('Edge Function error:', e);
    return new Response(JSON.stringify({ error: (e as any).message || 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
