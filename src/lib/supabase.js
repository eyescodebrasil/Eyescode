import AsyncStorage from '@react-native-async-storage/async-storage';

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jqlnltxajkczednnvgdx.supabase.co';

const SUPABASE_KEY = 'sb_publishable_cYfVkPhWNazI0YQPXLkj3A_na8AUxH_';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,

    autoRefreshToken: true,

    persistSession: true,

    detectSessionInUrl: false,
  },
});
