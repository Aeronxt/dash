import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cpwowrsesrefnugctpos.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwd293cnNlc3JlZm51Z2N0cG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MTc0NDcsImV4cCI6MjA1OTQ5MzQ0N30.VZ3r_VNe2_HuFrIiaUb-NePu8SMrLCStKefAplwn2vE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
}); 