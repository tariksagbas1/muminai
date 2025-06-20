import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ewxkgalpibbumalylmma.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3eGtnYWxwaWJidW1hbHlsbW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5ODY2MzUsImV4cCI6MjA2NTU2MjYzNX0.VVg1x3-m1bsuU2RpJgnGqUqACZ7FVdisdctjobGQ680';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);