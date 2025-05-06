
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nrgjaofrozgccdiebqwv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yZ2phb2Zyb3pnY2NkaWVicXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1MTk3NDAsImV4cCI6MjAzMTA5NTc0MH0.ILbON9eUn0owyFm577Xl19DcB22t8OuzpChBN7HMzFM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
