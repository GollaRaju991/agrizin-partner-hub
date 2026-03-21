import { createClient } from '@supabase/supabase-js';

const EXTERNAL_SUPABASE_URL = 'https://fytnskpijohbxgtngkhj.supabase.co';
const EXTERNAL_SUPABASE_ANON_KEY = 'sb_publishable_jy6URpjwA5awClQXofVsrQ_Ai34sU7c';

export const externalSupabase = createClient(EXTERNAL_SUPABASE_URL, EXTERNAL_SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: false,
    autoRefreshToken: false,
  },
});
