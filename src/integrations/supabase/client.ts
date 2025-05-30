
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const SUPABASE_URL = "https://nrgjaofrozgccdiebqwv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yZ2phb2Zyb3pnY2NkaWVicXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNzMxNzQsImV4cCI6MjA2MDk0OTE3NH0.GPWWb-yQhCcW0MRvH2veCaomF7uRUYJrddnTkeg5KP0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

/**
 * Checks if the connection to Supabase is working properly
 * @returns {Promise<boolean>} True if connection is successful, false otherwise
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Try to query a simple request to check if the connection works
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    
    // If there's no error, the connection is working
    return !error;
  } catch (err) {
    console.error('Error checking Supabase connection:', err);
    return false;
  }
};
