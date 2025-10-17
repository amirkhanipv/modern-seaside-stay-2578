import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-key',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check admin key
    const adminKey = req.headers.get('x-admin-key');
    if (adminKey !== 'admin-access-2024') {
      console.log('Invalid admin key');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role key (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { action, id, data } = await req.json();
    console.log('Admin action:', action, 'ID:', id, 'Data:', data);

    switch (action) {
      case 'update_called': {
        const { data: booking, error } = await supabaseAdmin
          .from('bookings')
          .update({ 
            called: data.called, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Update called error:', error);
          throw error;
        }

        console.log('Updated booking:', booking);
        return new Response(
          JSON.stringify(booking),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update_status': {
        const { data: booking, error } = await supabaseAdmin
          .from('bookings')
          .update({ 
            status: data.status, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Update status error:', error);
          throw error;
        }

        console.log('Updated booking:', booking);
        return new Response(
          JSON.stringify(booking),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        const { error } = await supabaseAdmin
          .from('bookings')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Delete error:', error);
          throw error;
        }

        console.log('Deleted booking:', id);
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
