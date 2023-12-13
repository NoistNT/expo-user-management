import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qyhpfvdkfnbhmmqcwmbl.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5aHBmdmRrZm5iaG1tcWN3bWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI0NzMzODMsImV4cCI6MjAxODA0OTM4M30.U4KczZ_XTbel3OqbMwvqGQw9mWN7zQS6wpozYBGhiYk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})
