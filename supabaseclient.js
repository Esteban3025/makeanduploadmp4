import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://evmvrcuagrzxwiqacnik.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2bXZyY3VhZ3J6eHdpcWFjbmlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDcwMzkxNywiZXhwIjoyMDc2Mjc5OTE3fQ.w2JWyM7haU-8ypI3R2lYRgwyQh4t6_hvsSS18e_-ZCk'; // service role key

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);